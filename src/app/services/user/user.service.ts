import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /** API url */
  private apiUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  updateUser(userId: string, user: { name: string; email: string }) {
    return this.http.put(`${this.apiUrl}/api/users/${userId}`, user);
  }
}
