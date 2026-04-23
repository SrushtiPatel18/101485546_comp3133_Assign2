import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_EMPLOYEES, GET_EMPLOYEE_BY_ID, SEARCH_EMPLOYEES } from '../graphql/queries';
import { ADD_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from '../graphql/mutations';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apollo = inject(Apollo);

  getEmployees(): Observable<any[]> {
    return this.apollo.query({
      query: GET_EMPLOYEES,
      fetchPolicy: 'network-only'
    }).pipe(
      map((res: any) => res.data?.getAllEmployees?.employees || [])
    );
  }

  getEmployeeById(eid: string): Observable<any> {
    return this.apollo.query({
      query: GET_EMPLOYEE_BY_ID,
      variables: { eid },
      fetchPolicy: 'network-only'
    }).pipe(
      map((res: any) => res.data?.getEmployeeByEid?.employee || null)
    );
  }

  searchEmployees(department: string, designation: string): Observable<any[]> {
    return this.apollo.query({
      query: SEARCH_EMPLOYEES,
      variables: { department, designation },
      fetchPolicy: 'network-only'
    }).pipe(
      map((res: any) => res.data?.searchEmployees?.employees || [])
    );
  }

  addEmployee(employeeData: any): Observable<any> {
    delete employeeData.employee_photo;
    const input = { ...employeeData, salary: parseFloat(employeeData.salary) || 0 };
    return this.apollo.mutate({
      mutation: ADD_EMPLOYEE,
      variables: { input }
    }).pipe(
      map((res: any) => {
        const { success, message, employee } = res.data.addEmployee;
        if (!success) throw new Error(message);
        return employee;
      })
    );
  }

  updateEmployee(eid: string, employeeData: any): Observable<any> {
    delete employeeData.employee_photo;
    const input = { ...employeeData, salary: parseFloat(employeeData.salary) || 0 };
    return this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: { eid, input }
    }).pipe(
      map((res: any) => {
        const { success, message, employee } = res.data.updateEmployeeByEid;
        if (!success) throw new Error(message);
        return employee;
      })
    );
  }

  deleteEmployee(eid: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { eid }
    }).pipe(
      map((res: any) => {
        const { success, message } = res.data.deleteEmployeeByEid;
        if (!success) throw new Error(message);
        return success;
      })
    );
  }
}
