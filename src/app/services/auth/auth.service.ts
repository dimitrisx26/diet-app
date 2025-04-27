import { Injectable, signal } from '@angular/core';
import { account, ID, teams } from '../../../lib/appwrite';

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

  constructor() {
    this.checkAuth();
  }

  /**
   * Checks if the user is authenticated
   */
  async checkAuth() {
    if (this.loggedInUser()) return;
    if (this.authCheckPromise) return this.authCheckPromise;

    this.authCheckPromise = (async () => {
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      this.isAuthenticated.set(isAuth);

      if (isAuth) {
        this.loggedInUser.set(await account.get());
      } else {
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
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();
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
    await account.create(ID.unique(), email, password, name);
    await this.login(email, password);
  }

  /**
   * Logout the user
   */
  async logout() {
    await account.deleteSession('current');
    this.loggedInUser.set(null);
    this.isAuthenticated.set(false);

    localStorage.removeItem('isAuthenticated');
  }

  /** Checks if the user is an admin */
  isAdmin(): boolean {
    return this.loggedInUser().prefs.admin === 'true';
  }
}
