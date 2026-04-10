import { Component, inject, signal } from '@angular/core';
import { Header } from '../header/header';
import { Employee } from '../../models/employee.type';
import { EmployeeService } from '../../service/employee.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  imports: [Header, ReactiveFormsModule],
  templateUrl: './create-employee.html',
  styleUrl: './create-employee.css',
})
export class CreateEmployee {

  employeeService = inject(EmployeeService);
  employee = signal<Employee>({} as Employee);

  errorMessage = '';
  
  protected employeeForm = new FormGroup({
    first_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    last_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    gender: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    designation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    salary: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    date_of_joining: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    department: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    employee_photo: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  onSubmit() {
    this.errorMessage = '';
    
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      console.warn('Employee form is invalid:', this.employeeForm.getRawValue());
      return;
    }

    const newEmployee = this.employeeForm.getRawValue();
    
    this.employeeService.addEmployee(
      newEmployee.first_name,
      newEmployee.last_name,
      newEmployee.email,
      newEmployee.gender,
      newEmployee.designation,
      newEmployee.salary,
      newEmployee.date_of_joining,
      newEmployee.department,
      newEmployee.employee_photo
    ).subscribe({
      next: (employee) => {
        console.log('Employee created successfully:', employee);
        this.employee.set(employee);
      },
      error: (error) => {
        console.error('Error creating employee:', error);
        this.errorMessage = 'Failed to create employee. Please try again.';
      }
    });
  }

}
