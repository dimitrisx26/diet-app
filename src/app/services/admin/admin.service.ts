import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, map, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  /** API url */
  private apiUrl = 'http://localhost:4000';

  /** The cached users */
  private users$ = this.getUsers().pipe(
    shareReplay(1),
  );

  /**
   * @param http HttpClient instance to make HTTP requests
   * @param toast MessageService instance to show toast messages
   */
  constructor(
    private http: HttpClient,
    private toast: MessageService,
  ) {}

  /**
   * Fetches the list of users from the server.
   * @returns An observable containing the list of users.
   */
  getUsers() {
    return this.http.get<any[]>(`${this.apiUrl}/api/users`);
  }

  /**
   * Fetches a user by ID from the server.
   * @param id The ID of the user to fetch.
   * @returns
   */
  getUserById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/api/users/${id}`);
  }

  /**
   * Update user on the server.
   * @param user The user data to create.
   * @returns An observable containing the created user.
   */
  updateUser(id: string, user: any) {
    return this.http.put<any>(`${this.apiUrl}/api/users/${id}`, user);
  }

  /**
   * Delete a user by ID from the server.
   * @param id The ID of the user to delete.
   * @returns
   */
  deleteUser(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/api/users/${id}`);
  }

  /**
   * Load admins from the server.
   * @returns An observable containing the list of admins.
   */
  loadAdmins() {
    return this.users$.pipe(
      map((users) => users.filter((user: any) => user.prefs?.admin === 'true')),
      catchError(() => {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load admins.',
        });
        return of([]);
      }),
    );
  }

  /**
   * Load users from the server.
   * @returns An observable containing the list of users.
   */
  loadUsers() {
    return this.users$.pipe(
      map((users) => users.filter((user: any) => user.prefs?.admin !== 'true')),
      catchError(() => {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users.',
        });
        return of([]);
      }),
    );
  }
}
