import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SupabaseService } from '../supabase/supabase.service';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  /** Cache keys */
  private readonly ADMIN_USERS_CACHE_KEY = 'admin_users';
  private readonly CLIENT_USERS_CACHE_KEY = 'client_users';
  private readonly ALL_USERS_CACHE_KEY = 'all_users';
  private readonly ADMIN_ROLES_CACHE_KEY = 'admin_roles';
  private readonly USER_PROFILE_CACHE_PREFIX = 'user_profile_';

  /** Cache durations (in milliseconds) */
  private readonly USERS_CACHE_TTL = 5 * 60 * 1000;
  private readonly USER_PROFILE_CACHE_TTL = 10 * 60 * 1000;

  /**
   * @param cache CacheService instance
   * @param supabase SupabaseService instance
   * @param toast MessageService instance to show toast messages
   */
  constructor(
    private cache: CacheService,
    private supabase: SupabaseService,
    private toast: MessageService,
  ) {}

  /**
   * Gets all users from the database
   * @returns Promise with array of all users
   */
  private async getAllUsers() {
    const cachedUsers = this.cache.get<any[]>(this.ALL_USERS_CACHE_KEY);
    if (cachedUsers) {
      return cachedUsers;
    }

    try {
      const { data: users, error } = await this.supabase
        .getSupabase()
        .from('user_profiles')
        .select('*');

      if (error) {
        throw error;
      }

      const result = users || [];
      this.cache.set(this.ALL_USERS_CACHE_KEY, result, this.USERS_CACHE_TTL);
      return result;
    } catch (error) {
      this.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch users',
      });
      console.error('Error fetching all users:', error);
      return [];
    }
  }

  /**
   * Gets all users with admin role
   * @returns Promise with array of admin users
   */
  async getAdminUsers() {
    const cachedAdmins = this.cache.get<any[]>(this.ADMIN_USERS_CACHE_KEY);
    if (cachedAdmins) {
      return cachedAdmins;
    }

    try {
      const [allUsers, adminIds] = await Promise.all([
        this.getAllUsers(),
        this.getAdminRoleIds(),
      ]);

      if (adminIds.length === 0) {
        this.cache.set(this.ADMIN_USERS_CACHE_KEY, [], this.USERS_CACHE_TTL);
        return [];
      }

      const adminUsers = allUsers.filter((user) => adminIds.includes(user.id));

      this.cache.set(
        this.ADMIN_USERS_CACHE_KEY,
        adminUsers,
        this.USERS_CACHE_TTL,
      );
      return adminUsers;
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
   * Gets IDs of all users with admin role
   * @returns Promise with array of admin user IDs
   */
  private async getAdminRoleIds() {
    const cachedAdminRoles = this.cache.get<string[]>(
      this.ADMIN_ROLES_CACHE_KEY,
    );
    if (cachedAdminRoles) {
      return cachedAdminRoles;
    }

    try {
      const { data: adminRoles, error } = await this.supabase
        .getSupabase()
        .from('user_roles')
        .select('user_id')
        .eq('is_admin', true);

      if (error) {
        throw error;
      }

      const adminIds = (adminRoles || []).map((role) => role.user_id);
      this.cache.set(
        this.ADMIN_ROLES_CACHE_KEY,
        adminIds,
        this.USERS_CACHE_TTL,
      );
      return adminIds;
    } catch (error) {
      this.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch admin roles',
      });
      console.error('Error fetching admin roles:', error);
      return [];
    }
  }

  /**
   * Gets all users that are not admins (clients)
   * @returns Promise with array of client users
   */
  async getClientUsers() {
    const cachedClients = this.cache.get<any[]>(this.CLIENT_USERS_CACHE_KEY);
    if (cachedClients) {
      return cachedClients;
    }

    try {
      const [allUsers, adminIds] = await Promise.all([
        this.getAllUsers(),
        this.getAdminRoleIds(),
      ]);

      const clientUsers = allUsers.filter(
        (user) => !adminIds.includes(user.id),
      );

      this.cache.set(
        this.CLIENT_USERS_CACHE_KEY,
        clientUsers,
        this.USERS_CACHE_TTL,
      );
      return clientUsers;
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
    const cacheKey = `${this.USER_PROFILE_CACHE_PREFIX}${id}`;

    const cachedUser = this.cache.get<any>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }
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

      if (data) {
        this.cache.set(cacheKey, data, this.USER_PROFILE_CACHE_TTL);
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

  /**
   * Invalidate user cache when user data changes
   * @param userId ID of the user whose cache should be invalidated
   */
  invalidateUserCache(userId: string): void {
    this.cache.remove(`${this.USER_PROFILE_CACHE_PREFIX}${userId}`);
    this.cache.remove(this.ADMIN_USERS_CACHE_KEY);
    this.cache.remove(this.CLIENT_USERS_CACHE_KEY);
    this.cache.remove(this.ALL_USERS_CACHE_KEY);
    this.cache.remove(this.ADMIN_ROLES_CACHE_KEY);
  }
}
