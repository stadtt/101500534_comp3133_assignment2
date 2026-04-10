import { Component, inject, signal } from '@angular/core';
import { Header } from '../header/header';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../models/employee.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  imports: [Header],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList {
  employeeService = inject(EmployeeService);
  employees = signal<Array<Employee>>([]);
  router = inject(Router);

  ngOnInit() {
    this.employeeService.GetAllEmployees()
    .subscribe({
      next: (employees) => {
        this.employees.set(employees);
        },
      error: (error) => {
        console.error('Error fetching employees:', error);
      }
    });
  }

  editEmployee(employeeId: number) {
    this.router.navigate(['/edit-employee', employeeId]);
  }

  deleteEmployee(employeeId: number) {
    console.log('Delete employee with ID:', employeeId);
    this.employeeService.deleteEmployee(employeeId.toString()).subscribe({
      next: () => {
        // Remove the employee from the list
        this.employees.set(this.employees().filter(emp => emp._id !== employeeId));
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
      }
    });

  }

  ViewEmployee(employeeId: number) {
    //pop a modal
  }
  addEmployee() {
    this.router.navigate(['/create-employee']);
  }
}
