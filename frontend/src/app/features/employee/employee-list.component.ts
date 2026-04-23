import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { EmployeeService } from '../../core/services/employee.service';
import { EmployeeDetailComponent } from './employee-detail.component';
import { EmployeeFormComponent } from './employee-form.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatIconModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatCardModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header class="header-content">
          <mat-card-title>Employee Directory</mat-card-title>
          <button mat-raised-button color="primary" (click)="openForm()">
            <mat-icon>person_add</mat-icon> Add Employee
          </button>
        </mat-card-header>
        <mat-card-content>
          <div class="search-filters">
            <mat-form-field appearance="outline">
              <mat-label>Search Designation</mat-label>
              <input matInput [formControl]="searchDesignation" placeholder="e.g. Developer">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Search Department</mat-label>
              <input matInput [formControl]="searchDepartment" placeholder="e.g. IT">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
          <div class="table-container mat-elevation-z8">
            <table mat-table [dataSource]="dataSource" matSort>
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
                <td mat-cell *matCellDef="let emp">{{ emp.first_name }} {{ emp.last_name }}</td>
              </ng-container>
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
                <td mat-cell *matCellDef="let emp">{{ emp.email }}</td>
              </ng-container>
              <ng-container matColumnDef="designation">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Designation</th>
                <td mat-cell *matCellDef="let emp">{{ emp.designation }}</td>
              </ng-container>
              <ng-container matColumnDef="department">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Department</th>
                <td mat-cell *matCellDef="let emp">{{ emp.department }}</td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let emp">
                  <button mat-icon-button color="primary" (click)="viewDetails(emp._id)" matTooltip="View">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="openForm(emp)" matTooltip="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteEmployee(emp._id)" matTooltip="Delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">No records found</td>
              </tr>
            </table>
            <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 20px;
    }
    .search-filters {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    mat-form-field {
      width: 100%;
      max-width: 300px;
    }
    .table-container {
      overflow-x: auto;
      border-radius: 8px;
    }
    table {
      width: 100%;
    }
    .no-data {
      text-align: center;
      padding: 1rem 0;
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'email', 'designation', 'department', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchDesignation = new FormControl('');
  searchDepartment = new FormControl('');

  ngOnInit(): void {
    this.loadEmployees();

    this.searchDesignation.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.filterEmployees());

    this.searchDepartment.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.filterEmployees());
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.snackBar.open('Error loading employees', 'Close', { duration: 4000 })
    });
  }

  filterEmployees(): void {
    const designation = this.searchDesignation.value || '';
    const department = this.searchDepartment.value || '';
    if (designation || department) {
      this.employeeService.searchEmployees(department, designation).subscribe({
        next: (data) => this.dataSource.data = data,
        error: () => this.snackBar.open('Search failed', 'Close', { duration: 3000 })
      });
    } else {
      this.loadEmployees();
    }
  }

  viewDetails(id: string): void {
    this.dialog.open(EmployeeDetailComponent, { width: '600px', data: { _id: id } });
  }

  openForm(employee?: any): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '600px',
      data: employee || null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadEmployees();
    });
  }

  deleteEmployee(id: string): void {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.snackBar.open('Employee deleted successfully', 'Close', { duration: 3000 });
        this.loadEmployees();
      },
      error: () => this.snackBar.open('Error deleting employee', 'Close', { duration: 3000 })
    });
  }
}
