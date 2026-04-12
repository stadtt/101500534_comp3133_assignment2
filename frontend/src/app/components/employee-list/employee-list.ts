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
  allEmployees = signal<Array<Employee>>([]);
  employees = signal<Array<Employee>>([]);
  filterField = signal<'department' | 'designation'>('department');
  searchTerm = signal('');
  router = inject(Router);

  ngOnInit() {
    this.employeeService.GetAllEmployees()
    .subscribe({
      next: (employees) => {
        this.allEmployees.set(employees);
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
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        console.log('Employee deleted successfully');
        // Refresh the employee list after deletion
        this.employeeService.GetAllEmployees().subscribe({
          next: (employees) => {
            this.allEmployees.set(employees);
            this.applyFilters();
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

  viewEmployee(employeeId: string) {
  
    this.router.navigate(['/view-employee', employeeId]);
  }
  addEmployee() {
    this.router.navigate(['/create-employee']);
  }
  searchByDesignation(designation: string) {
    this.employeeService.SearchEmployeeByDesignation(designation).subscribe({
      next: (employees) => {
        this.employees.set(employees);
      },
      error: (error) => {
        console.error('Error searching employees by designation:', error);
      }
    });
  }

  searchByDepartment(department: string) {
    this.employeeService.SearchEmployeeByDepartment(department).subscribe({
      next: (employees) => {
        this.employees.set(employees);
      },
      error: (error) => {
        console.error('Error searching employees by department:', error);
      }
    });
  }

  onFilterFieldChange(field: string) {
    if (field === 'department' || field === 'designation') {
      this.filterField.set(field);
      this.applyFilters();
    }
  }

  onSearchTermChange(term: string) {
    this.searchTerm.set(term);
    this.applyFilters();
  }

  clearFilters() {
    this.filterField.set('department');
    this.searchTerm.set('');
    this.employees.set(this.allEmployees());
  }

  private applyFilters() {
    const field = this.filterField();
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      this.employees.set(this.allEmployees());
      return;
    }

    const filtered = this.allEmployees().filter((employee) => {
      const value = (employee[field] || '').toString().toLowerCase();
      return value.includes(term);
    });

    this.employees.set(filtered);
  }
}
