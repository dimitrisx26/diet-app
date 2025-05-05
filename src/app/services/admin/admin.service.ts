import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  /**
   * @param supabase SupabaseService instance
   * @param toast MessageService instance to show toast messages
   */
  constructor(
    private supabase: SupabaseService,
    private toast: MessageService,
  ) {}

  /**
   * Gets all users with admin role
   * @returns Promise with array of admin users
   */
  async getAdminUsers() {
    try {
      const { data: adminRoles, error: rolesError } = await this.supabase
        .getSupabase()
        .from('user_roles')
        .select('user_id')
        .eq('is_admin', true);

      if (rolesError) {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch admin roles',
        });
        console.error('Error fetching admin roles:', rolesError);
        return [];
      }

      if (!adminRoles || adminRoles.length === 0) {
        return [];
      }

      const adminIds = adminRoles.map((role) => role.user_id);
      const { data: adminUsers, error: usersError } = await this.supabase
        .getSupabase()
        .from('user_profiles')
        .select('*')
        .in('id', adminIds);

      if (usersError) {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch admin users',
        });
        console.error('Error fetching admin users:', usersError);
        return [];
      }

      return adminUsers || [];
    } catch (err) {
      this.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An unexpected error occurred',
      });
      console.error('Error in getAdminUsers:', err);
      return [];
    }
  }

  /**
   * Gets all users that are not admins (clients)
   * @returns Promise with array of client users
   */
  async getClientUsers() {
    try {
      const { data: adminRoles, error: rolesError } = await this.supabase
        .getSupabase()
        .from('user_roles')
        .select('user_id')
        .eq('is_admin', true);

      if (rolesError) {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch admin roles',
        });
        console.error('Error fetching admin roles:', rolesError);
        return [];
      }

      let query = this.supabase.getSupabase().from('user_profiles').select('*');

      if (adminRoles && adminRoles.length > 0) {
        const adminIds = adminRoles.map((role) => role.user_id);
        query = query.not('id', 'in', `(${adminIds.join(',')})`);
      }

      const { data: clientUsers, error: usersError } = await query;

      if (usersError) {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch client users',
        });
        console.error('Error fetching client users:', usersError);
        return [];
      }

      return clientUsers || [];
    } catch (err) {
      this.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An unexpected error occurred',
      });
      console.error('Error in getClientUsers:', err);
      return [];
    }
  }

  /**
   * It loads a user's data based on their id
   * @param id the user's id
   * @returns the user's data or null
   */
  async getUserById(id: string): Promise<any | null> {
    try {
      const { data, error } = await this.supabase
        .getSupabase()
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to fetch user profile for ID: ${id}`,
        });
        console.error(`Error fetching user profile for ID ${id}:`, error);
        return null;
      }

      return data;
    } catch (err) {
      this.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An unexpected error occurred while fetching user profile',
      });
      console.error('Error in getUserById:', err);
      return null;
    }
  }
}
