import { Injectable, signal } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Auth state of the app */
  isAuthenticated = signal<boolean>(false);

  /** User object */
  loggedInUser = signal<any>(null);

  /** Prevents duplicate checkAuth calls */
  private authCheckPromise: Promise<void> | null = null;

  constructor(private supabase: SupabaseService) {
    this.checkAuth();
  }

  /**
   * Checks if the user is authenticated
   */
  async checkAuth() {
    if (this.loggedInUser()) return;
    if (this.authCheckPromise) return this.authCheckPromise;

    this.authCheckPromise = (async () => {
      try {
        const user = await this.supabase.getUser();
        if (user) {
          this.loggedInUser.set(user);
          this.isAuthenticated.set(true);
          localStorage.setItem('isAuthenticated', 'true');
        } else {
          await this.logout();
        }
      } catch {
        await this.logout();
      }
    })();

    await this.authCheckPromise;
    this.authCheckPromise = null;
  }

  /**
   * Login the user
   * @param email the email of the user
   * @param password the password of the user
   */
  async login(email: string, password: string) {
    const user = await this.supabase.signIn(email, password);

    this.loggedInUser.set(user);
    this.isAuthenticated.set(true);

    localStorage.setItem('isAuthenticated', 'true');
  }

  /**
   * Register a new user
   * @param email the email of the user
   * @param password the password of the user
   * @param name the name of the user
   */
  async register(email: string, password: string, name: string) {
    const user = await this.supabase.signUp(email, password, name);

    this.loggedInUser.set(user);
    this.isAuthenticated.set(true);

    localStorage.setItem('isAuthenticated', 'true');
  }

  /**
   * Logout the user
   */
  async logout() {
    await this.supabase.signOut();

    this.loggedInUser.set(null);
    this.isAuthenticated.set(false);

    localStorage.removeItem('isAuthenticated');
  }

  /** Checks if the user is an admin */
  isAdmin(): boolean {
    return this.loggedInUser()?.user_metadata?.admin === true;
  }
}
