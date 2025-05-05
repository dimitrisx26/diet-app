import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { SupabaseService } from '../supabase/supabase.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * @param supabase Instance of the supabase service
   */
  constructor(private supabase: SupabaseService) {}

  /**
   * Updates a user's profile in Supabase
   * @param userData User data to update (name, email, phone)
   * @returns An observable with the update result
   */
  updateUser(
    userData: { user_metadata?: any; email?: string; phone?: string },
  ): Observable<any> {
    return from(
      this.supabase.getSupabase().auth.updateUser({
        data: userData.user_metadata,
        email: userData.email,
      }),
    ).pipe(
      map((response) => {
        if (response.error) {
          throw response.error;
        }
        return response.data;
      }),
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError(
          () => new Error(error.message || 'Failed to update user profile'),
        );
      }),
    );
  }
}
