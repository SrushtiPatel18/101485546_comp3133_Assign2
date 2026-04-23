import { gql } from 'apollo-angular';

export const GET_EMPLOYEES = gql`
  query GetEmployees {
    getAllEmployees {
      success
      message
      employees {
        _id
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
      }
    }
  }
`;

export const SEARCH_EMPLOYEES = gql`
  query SearchEmployees($department: String, $designation: String) {
    searchEmployees(department: $department, designation: $designation) {
      success
      message
      employees {
        _id
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
      }
    }
  }
`;

export const GET_EMPLOYEE_BY_ID = gql`
  query GetEmployeeByEid($eid: ID!) {
    getEmployeeByEid(eid: $eid) {
      success
      message
      employee {
        _id
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
      }
    }
  }
`;
