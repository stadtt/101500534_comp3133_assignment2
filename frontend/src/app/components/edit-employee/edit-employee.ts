import { Component, inject, signal } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../models/employee.type';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../header/header';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

const CLOUDINARY_URL_PATTERN = /^https:\/\/res\.cloudinary\.com\/.+/i;


@Component({
  selector: 'app-edit-employee',
  imports: [Header, ReactiveFormsModule],
  templateUrl: './edit-employee.html',
  styleUrl: './edit-employee.css',
})
export class EditEmployee {

  constructor(private  route: ActivatedRoute) {}
  
  employeeService = inject(EmployeeService);
  router = inject(Router);
  employee = signal<Employee>({} as Employee);

  errorMessage = '';

  protected employeeForm = new FormGroup({
    first_name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)] }),
    last_name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    gender: new FormControl('Other', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^(Male|Female|Other)$/)] }),
    designation: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)] }),
    salary: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    date_of_joining: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    department: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)] }),
    employee_photo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(CLOUDINARY_URL_PATTERN)]
    })
  });

  onSubmit() {
    this.errorMessage = '';
    
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      console.warn('Employee form is invalid:', this.employeeForm.getRawValue());
      return;
    }

    const updatedEmployee = {
      ...this.employee(),
      ...this.employeeForm.getRawValue()
    };
    
    this.employeeService.updateEmployee(
      String(updatedEmployee._id),
      updatedEmployee.first_name,
      updatedEmployee.last_name,
      updatedEmployee.email,
      updatedEmployee.gender,
      updatedEmployee.designation,
      updatedEmployee.salary,
      updatedEmployee.date_of_joining,
      updatedEmployee.department,
      updatedEmployee.employee_photo
    ).subscribe({
      next: (employee) => {
        if (!employee) {
          this.errorMessage = 'Failed to update employee. Please try again.';
          return;
        }

        this.employee.set(employee);
        this.router.navigate(['/view-employee', employee._id]);
      },
      error: (error) => {
        console.error('Error updating employee:', error);
        this.errorMessage = 'Failed to update employee. Please try again.';
      } 
    });
  }


  ngOnInit() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.employeeService.getEmployeeById(employeeId).subscribe({
        next: (employee) => {
          this.employee.set(employee);
          this.employeeForm.patchValue(employee);
          console.log('Fetched employee:', employee);
        },
        error: (error) => {
          console.error('Error fetching employee:', error);
        },
      });
    }
  }
  backToList(): void {
    window.history.back();
  }

}

