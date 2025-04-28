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

  /** Prevents duplicate isAdmin checks */
  private isAdminPromise: Promise<boolean> | null = null;

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

  /**
   * Checks if the user is an admin
   * @returns Promise that resolves to whether the user is an admin
   */
  async isAdmin(): Promise<boolean> {
    const user = this.loggedInUser();
    
    if (!user) return false;
    
    if (user._isAdmin !== undefined) {
      return user._isAdmin;
    }
    
    if (this.isAdminPromise) {
      return this.isAdminPromise;
    }
    
    this.isAdminPromise = (async () => {
      try {
        const { data } = await this.supabase
          .getSupabase()
          .from('user_roles')
          .select('is_admin')
          .eq('user_id', user.id)
          .single();
        
        const isAdmin = data?.is_admin || false;
        
        this.loggedInUser.update(currentUser => 
          currentUser ? {...currentUser, _isAdmin: isAdmin} : currentUser
        );
        
        return isAdmin;
      } catch {
        this.loggedInUser.update(currentUser => 
          currentUser ? {...currentUser, _isAdmin: false} : currentUser
        );
        return false;
      } finally {
        this.isAdminPromise = null;
      }
    })();
    
    return this.isAdminPromise;
  }
}
