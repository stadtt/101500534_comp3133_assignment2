import { Component, inject, signal } from '@angular/core';
import { Header } from '../header/header';
import { Employee } from '../../models/employee.type';
import { EmployeeService } from '../../service/employee.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-employee',
  imports: [Header],
  templateUrl: './view-employee.html',
  styleUrl: './view-employee.css',
})
export class ViewEmployee {


  constructor(private route: ActivatedRoute, private router: Router) {}
  
  employeeService = inject(EmployeeService);
  employee = signal<Employee>({} as Employee);
  imageLoadFailed = signal(false);

  backToList(): void {
    this.router.navigate(['/employee-list']);
  }

  backToEdit(): void {
    const employeeId = this.employee()?._id || this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.router.navigate([`/edit-employee/${employeeId}`]);
    }
  }

  onImageError(): void {
    this.imageLoadFailed.set(true);
  }

  ngOnInit() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.employeeService.getEmployeeById(employeeId).subscribe({
        next: (employee) => {
          this.employee.set(employee);
          this.imageLoadFailed.set(false);
    
          console.log('Fetched employee:', employee);
        },
        error: (error) => {
          console.error('Error fetching employee:', error);
        },
      });
    }
  }
}
