import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase/supabase.service';
import { User } from '@supabase/supabase-js';

export interface UserState {
  isAuthenticated: boolean;
  user: any | null;
  isAdmin: boolean;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  /** Auth state of the app */
  private state = signal<UserState>({
    isAuthenticated: false,
    user: null,
    isAdmin: false,
    isLoading: false,
  });

  /** Selectors of the app */
  readonly user = computed(() => this.state().user);
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  readonly isAdmin = computed(() => this.state().isAdmin);
  readonly isLoading = computed(() => this.state().isLoading);

  /**
   * @param supabase SupabaseService instance to handle authentication
   * @param router Router instance to navigate between routes
   */
  constructor(
    private supabase: SupabaseService,
    private router: Router,
  ) { }

  /** Initialize auth state */
  async initAuth(): Promise<void> {
    this.setLoading(true);

    try {
      const { data } = await this.supabase.getSupabase().auth.getSession();
      if (data?.session) {
        const user = data.session.user;
        await this.loadUserAdminStatus(user);
      } else {
        this.clearAuth();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.clearAuth();
    } finally {
      this.setLoading(false);
    }
  }

  /** Handles login */
  async login(email: string, password: string): Promise<void> {
    this.setLoading(true);

    try {
      const { data, error } = await this.supabase
        .getSupabase()
        .auth.signInWithPassword({
          email,
          password,
        });

      if (error) throw error;

      if (data?.user) {
        await this.loadUserAdminStatus(data.user);
        this.navigateByRole();
      }
    } catch (error) {
      this.clearAuth();
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /** Handles logout */
  async logout(): Promise<void> {
    await this.supabase.getSupabase().auth.signOut();
    this.clearAuth();
    this.router.navigate(['/auth']);
  }

  /** Handles registration */
  async register(email: string, password: string, name: string): Promise<void> {
    this.setLoading(true);
    try {
      const { data, error } = await this.supabase.getSupabase().auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      
      if (error) throw error;
      
      if (data?.user) {
        try {
          const { error: roleError } = await this.supabase.getSupabase()
            .from('user_roles')
            .insert([
              { user_id: data.user.id, is_admin: false }
            ]);
          
          if (roleError) console.error('Role creation error:', roleError);
        } catch (e) {
          console.error('Error creating role:', e);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await this.loadUserAdminStatus(data.user);
        this.navigateByRole();
      }
    } catch (error) {
      this.clearAuth();
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /** Loads user admin status */
  private async loadUserAdminStatus(user: User): Promise<void> {
    if (!user) return;

    try {
      this.state.update((state) => ({
        ...state,
        isAuthenticated: true,
        user: user,
      }));

      const { data, error } = await this.supabase
        .getSupabase()
        .from('user_roles')
        .select('is_admin')
        .eq('user_id', user.id)
        .maybeSingle();
  
      if (error) {
        console.error('Error querying user_roles:', error);
        
        try {
          const { error: insertError } = await this.supabase
            .getSupabase()
            .from('user_roles')
            .insert([{ user_id: user.id, is_admin: false }]);
            
          if (insertError) {
            console.error('Failed to create backup role:', insertError);
            throw new Error('Database error granting user');
          }
        } catch (e) {
          console.error('Error in backup role creation:', e);
        }
      }
  
      const isAdmin = data?.is_admin || false;
  
      this.state.update((state) => ({
        ...state,
        isAuthenticated: true,
        user: user,
        isAdmin: isAdmin,
      }));
    } catch (error) {
      console.error('Error loading admin status:', error);
      
      this.state.update((state) => ({
        ...state,
        isAuthenticated: true,
        user: user,
        isAdmin: false,
      }));
    }
  }

  /** Navigate user based on their role */
  private navigateByRole(): void {
    if (this.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/profile']);
    }
  }

  /** Sets loading state */
  private setLoading(isLoading: boolean): void {
    this.state.update((state) => ({ ...state, isLoading }));
  }

  /** Clears authentication state */
  private clearAuth(): void {
    this.state.update(() => ({
      isAuthenticated: false,
      user: null,
      isAdmin: false,
      isLoading: false,
    }));
  }
}
