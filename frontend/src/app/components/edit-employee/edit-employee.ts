import { Component, inject, signal } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../models/employee.type';
import { ActivatedRoute } from '@angular/router';
import { Header } from '../header/header';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-edit-employee',
  imports: [Header, ReactiveFormsModule],
  templateUrl: './edit-employee.html',
  styleUrl: './edit-employee.css',
})
export class EditEmployee {

  constructor(private  route: ActivatedRoute) {}
  
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
        this.employee.set(employee);
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

}

