import { Component, inject, signal } from '@angular/core';
import { Header } from '../header/header';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../models/emplotee.type';

@Component({
  selector: 'app-admin-view',
  imports: [Header],
  templateUrl: './admin-view.html',
  styleUrl: './admin-view.css',
})
export class AdminView {
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
    // Implement edit functionality here
  }

  deleteEmployee(employeeId: number) {
    console.log('Delete employee with ID:', employeeId);
    // Implement delete functionality here
  }

}
