import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
}
