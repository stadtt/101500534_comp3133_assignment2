import { Routes } from '@angular/router';

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
        loadComponent: () => import('./components/employee-list/employee-list').then(m => m.EmployeeList)
    }
];
