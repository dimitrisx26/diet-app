import { Injectable } from '@angular/core';
import { account, ID } from '../../../lib/appwrite';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Auth state of the app */
  isAuthenticated: boolean = false;

  /** User object */
  loggedInUser: any = null;

  /** User email */
  email: string = '';

  /** User password */
  password: string = '';

  /** User name */
  name: string = '';

  constructor() {
    this.checkAuth();
  }

  /**
   * Checks if the user is authenticated
   */
  async checkAuth() {
    this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (this.isAuthenticated) {
      this.loggedInUser = await account.get();
    }
  }

  /**
   * Login the user
   * @param email the email of the user
   * @param password the password of the user
   */
  async login(email: string, password: string) {
    await account.createEmailPasswordSession(email, password);

    this.loggedInUser = await account.get();
    this.isAuthenticated = true;

    localStorage.setItem('isAuthenticated', 'true');
  }

  /**
   * Register a new user
   * @param email the email of the user
   * @param password the password of the user
   * @param name the name of the user
   */
  async register(email: string, password: string, name: string) {
    await account.create(ID.unique(), email, password, name);
    this.login(email, password);
  }

  /**
   * Logout the user
   */
  async logout() {
    await account.deleteSession('current');
    this.loggedInUser = null;
    this.isAuthenticated = false;

    localStorage.removeItem('isAuthenticated');
  }
}
