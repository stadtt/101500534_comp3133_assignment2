import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, pipe } from 'rxjs';
import { first, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  private PATH = "/graphql";
  private HOST = "http://localhost:4000";
  private fullUrl = this.HOST + this.PATH;

  constructor(private apollo: Apollo) { }
  
  GetAllEmployees(): Observable<any> {
    return this.apollo
      .query({
        query: gql`
          query GetAllEmployees {
            getAllEmployees {
              _id
              first_name
              last_name
              email
              gender
              designation
              salary
              date_of_joining
              department
              employee_photo
            }
          }
        `,
        context: {
          uri: this.fullUrl,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((result: any) => result?.data?.getAllEmployees ?? null));
  }

  getEmployeeById(id: string): Observable<any> {
    return this.apollo
      .query({
        query: gql`
          query GetEmployeeById($_id: ID!) {
            getEmployeeById(_id: $_id) {
              _id
              first_name
              last_name
              email
              gender
              designation
              salary
              date_of_joining
              department
              employee_photo


        }
      }        `,
        variables: {
          _id: id,
        },
        context: {
          uri: this.fullUrl,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((result: any) => result?.data?.getEmployeeById ?? null));
  }

  updateEmployee(id: string, first_name: string, last_name: string, email: string, gender: string,
     designation: string, salary: number, date_of_joining: string, department: string, employee_photo: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation UpdateEmployee(
          $_id: ID!
          $first_name: String
          $last_name: String
          $email: String
          $gender: String
          $designation: String
          $salary: Float
          $date_of_joining: String
          $department: String
          $employee_photo: String
          ){
        updateEmployee(
          _id: $_id 
          first_name: $first_name
          last_name: $last_name
          email: $email
          gender: $gender
          designation: $designation
          salary: $salary
          date_of_joining: $date_of_joining
          department: $department
          employee_photo: $employee_photo
          )     
          {
          _id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          employee_photo
          }
      }
        `,
        variables: {
          _id: id,
          first_name: first_name,
          last_name: last_name,
          email: email,
          gender: gender,
          designation: designation,
          salary: salary,
          date_of_joining: date_of_joining,
          department: department,
          employee_photo: employee_photo
        },
        context: {
          uri: this.fullUrl,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((result: any) => result?.data?.updateEmployee ?? null));
  }

}
      

