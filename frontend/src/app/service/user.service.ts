import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private PATH = "/graphql";
  private HOST = "http://127.0.0.1:4000";
  private fullUrl = this.HOST + this.PATH;

  constructor(private apollo: Apollo) { }

  LoginUser(username: string, password: string): Observable<any> {
    return this.apollo
      .query({
        query: gql`
          query LoginUser($username: String!, $password: String!) {
            loginUser(username: $username, password: $password) {
              id
              username
              email
            }
          }
        `,
        variables: {
          username,
          password,
        },
        context: {
          uri: this.fullUrl,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((result: any) => result?.data?.loginUser ?? null));
  }
  SignupUser(email: string, username: string, password: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation SignupUser($username: String!, $password: String!, $email: String!) {
            signupUser(username: $username, password: $password, email: $email) {
              id
              username
              email
            }
          }
        `,
        variables: {
          email,
          username,
          password,
        },
        context: {
          uri: this.fullUrl,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((result: any) => result?.data?.signupUser ?? null));
  }
}
