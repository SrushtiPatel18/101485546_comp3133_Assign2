import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>Employee Details</h2>
    <mat-dialog-content>
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
      <div *ngIf="!loading && employee" class="details-grid">
        <div class="photo-container" *ngIf="employee.employee_photo">
          <img [src]="employee.employee_photo" alt="Employee Photo" class="employee-photo"/>
        </div>
        <div class="info-group">
          <strong>First Name</strong><span>{{ employee.first_name }}</span>
        </div>
        <div class="info-group">
          <strong>Last Name</strong><span>{{ employee.last_name }}</span>
        </div>
        <div class="info-group">
          <strong>Email</strong><span>{{ employee.email }}</span>
        </div>
        <div class="info-group">
          <strong>Gender</strong><span class="capitalize">{{ employee.gender }}</span>
        </div>
        <div class="info-group">
          <strong>Designation</strong><span>{{ employee.designation }}</span>
        </div>
        <div class="info-group">
          <strong>Department</strong><span>{{ employee.department }}</span>
        </div>
        <div class="info-group">
          <strong>Salary</strong><span>{{ employee.salary | currency }}</span>
        </div>
        <div class="info-group">
          <strong>Date of Joining</strong><span>{{ employee.date_of_joining | date:'mediumDate' }}</span>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      padding: 1rem 0;
    }
    .info-group {
      display: flex;
      flex-direction: column;
    }
    .info-group strong {
      color: #555;
      font-size: 0.85rem;
      text-transform: uppercase;
    }
    .info-group span {
      font-size: 1.1rem;
      color: #222;
    }
    .capitalize {
      text-transform: capitalize;
    }
    .photo-container {
      grid-column: 1 / -1;
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }
    .employee-photo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class EmployeeDetailComponent implements OnInit {
  employee: any = null;
  loading = true;

  private employeeService = inject(EmployeeService);

  constructor(
    public dialogRef: MatDialogRef<EmployeeDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { _id: string }
  ) {}

  ngOnInit(): void {
    this.employeeService.getEmployeeById(this.data._id).subscribe({
      next: (emp) => {
        this.employee = emp;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
