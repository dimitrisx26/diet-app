import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { SupabaseService } from '../supabase/supabase.service';
import { catchError, map } from 'rxjs/operators';
import { CacheService } from '../cache/cache.service';
import { AdminService } from '../admin/admin.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /** Cache key */
  private readonly USER_PROFILE_CACHE_PREFIX = 'user_profile_';

  /** Cache duration */
  private readonly USER_PROFILE_CACHE_TTL = 10 * 60 * 1000;

  /**
   * @param admin Instance of the admin service
   * @param cache CacheService instance
   * @param supabase Instance of the supabase service
   */
  constructor(
    private admin: AdminService,
    private cache: CacheService,
    private supabase: SupabaseService,
  ) {}

  /**
   * Updates a user's profile in Supabase
   * @param userData User data to update (name, email, phone)
   * @returns An observable with the update result
   */
  updateUser(userData: {
    user_metadata?: any;
    email?: string;
    phone?: string;
  }): Observable<any> {
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

        if (userData.phone) {
          this.updateUserPhone(response.data.user.id, userData.phone);
        }

        if (response.data.user.id) {
          this.cache.remove(
            `${this.USER_PROFILE_CACHE_PREFIX}${response.data.user.id}`,
          );
          this.admin.invalidateUserCache(response.data.user.id);
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

  /**
   *  It stores phone in custom profile table
   * @param userId user's id
   * @param phone user's phone number
   */
  private updateUserPhone(userId: string, phone: string): void {
    this.supabase
      .getSupabase()
      .from('user_profiles')
      .upsert({ id: userId, phone: phone })
      .then(({ error }) => {
        if (error) console.error('Error updating phone in profile:', error);
        else {
          this.cache.remove(`${this.USER_PROFILE_CACHE_PREFIX}${userId}`);
        }
      });
  }
}
