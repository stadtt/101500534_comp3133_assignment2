import { Component, inject, signal } from '@angular/core';
import { Header } from '../header/header';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../models/emplotee.type';

@Component({
  selector: 'app-employee-list',
  imports: [Header],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList {
  employeeService = inject(EmployeeService);
  employees = signal<Array<Employee>>([]);

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
    console.log('Edit employee with ID:', employeeId);
  }

  deleteEmployee(employeeId: number) {
    console.log('Delete employee with ID:', employeeId);
   
  }
  addEmployee() {
    console.log('Add new employee');
  }
}
