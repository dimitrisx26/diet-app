import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  /**
   * Sign up a new user
   * @param email The email of the user
   * @param password The password of the user
   * @param name The name of the user
   * @returns The user object
   */
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (error) throw error;
    return data.user;
  }

  /**
   * Sign in an existing user
   * @param email The email of the user
   * @param password The password of the user
   * @returns The user object
   */
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Get the current user
   * @returns The user object
   */
  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  /**
   * @returns The list of all users
   */
  getAllUsers() {
    return this.supabase
      .from('users')
      .select('*')
      .then(({ data, error }) => {
        if (error) throw error;
        return data;
      });
  }

  /**
   * Update a user
   * @param userId The ID of the user
   * @param user The user object
   * @returns The updated user object
   */
  async updateUser(userId: string, user: Partial<User>) {
    const { data, error } = await this.supabase
      .from('users')
      .update(user)
      .eq('id', userId);
    if (error) throw error;
    return data;
  }

  /**
   * @returns The supabase client
   */
  getSupabase() {
    return this.supabase;
  }
}