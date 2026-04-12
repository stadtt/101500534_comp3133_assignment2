import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/home/home').then(m => m.Home)

    },
    {
        path: 'login',
        pathMatch: 'full',
        loadComponent: () => import('./components/login/login').then(m => m.Login)
    },
    {
        path: 'signup',
        pathMatch: 'full',  
        loadComponent: () => import('./components/signup/signup').then(m => m.Signup)
    },
    {
        path: 'employee-list',
        pathMatch: 'full',
        canActivate: [authGuard],
        loadComponent: () => import('./components/employee-list/employee-list').then(m => m.EmployeeList)
    },
    {
        path:"create-employee",
        pathMatch: 'full',
        canActivate: [authGuard],
        loadComponent: () => import('./components/create-employee/create-employee').then(m => m.CreateEmployee)
    },
    {
        path:"edit-employee/:id",
        pathMatch: 'full',
        canActivate: [authGuard],
        loadComponent: () => import('./components/edit-employee/edit-employee').then(m => m.EditEmployee)
    },
    {
        path:"view-employee/:id",
        pathMatch: 'full',
        canActivate: [authGuard],
        loadComponent: () => import('./components/view-employee/view-employee').then(m => m.ViewEmployee)
    }
    
];
