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

  editEmployee(employeeId: string) {
    this.router.navigate(['/edit-employee', employeeId]);
  }

  deleteEmployee(employeeId: string) {
    console.log('Delete employee with ID:', employeeId);
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        console.log('Employee deleted successfully');
        // Refresh the employee list after deletion
        this.employeeService.GetAllEmployees().subscribe({
          next: (employees) => {
            this.employees.set(employees);
          },
          error: (error) => {
            console.error('Error fetching employees after deletion:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
      }
    });

  }

  ViewEmployee(employeeId: string) {
    //pop a modal
  }
  addEmployee() {
    this.router.navigate(['/create-employee']);
  }
}
