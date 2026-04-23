import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Employee' : 'Add Employee' }}</h2>
    <form [formGroup]="empForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="first_name">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="last_name">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Gender</mat-label>
            <mat-select formControlName="gender">
              <mat-option value="Male">Male</mat-option>
              <mat-option value="Female">Female</mat-option>
              <mat-option value="Other">Other</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Designation</mat-label>
            <input matInput formControlName="designation">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Department</mat-label>
            <input matInput formControlName="department">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Salary</mat-label>
            <input matInput type="number" formControlName="salary">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Date of Joining</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date_of_joining">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Photo URL (Optional)</mat-label>
            <input matInput formControlName="employee_photo" placeholder="https://...">
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="empForm.invalid || loading">
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private snackBar = inject(MatSnackBar);

  empForm!: FormGroup;
  isEdit = false;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.empForm = this.fb.group({
      first_name: [this.data?.first_name || '', Validators.required],
      last_name: [this.data?.last_name || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      gender: [this.data?.gender || '', Validators.required],
      designation: [this.data?.designation || '', Validators.required],
      department: [this.data?.department || '', Validators.required],
      salary: [this.data?.salary || '', [Validators.required, Validators.min(0)]],
      date_of_joining: [this.data?.date_of_joining ? new Date(this.data.date_of_joining) : '', Validators.required],
      employee_photo: [this.data?.employee_photo || '']
    });
  }

  onSubmit(): void {
    if (this.empForm.invalid) return;
    this.loading = true;
    const formValue = { ...this.empForm.value };
    if (formValue.date_of_joining) {
      formValue.date_of_joining = new Date(formValue.date_of_joining).toISOString();
    }
    const request$ = this.isEdit
      ? this.employeeService.updateEmployee(this.data._id, formValue)
      : this.employeeService.addEmployee(formValue);

    request$.subscribe({
      next: () => {
        this.snackBar.open(`Employee ${this.isEdit ? 'updated' : 'added'} successfully`, 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Operation failed', 'Close', { duration: 3000 });
      }
    });
  }
}
