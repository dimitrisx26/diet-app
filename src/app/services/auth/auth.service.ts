import { Injectable, Signal, signal } from '@angular/core';
import { account, client, ID, teams } from '../../../lib/appwrite';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Auth state of the app */
  isAuthenticated = signal<boolean>(false);

  /** User object */
  loggedInUser = signal<any>(null);

  /** Users teams */
  userTeams = signal<any[]>([]);

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
        const teamList = await teams.list();
        this.userTeams.set(teamList.teams || []);
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
    this.loggedInUser.set(await account.get());
    this.isAuthenticated.set(true);

    const teamList = await teams.list();
    this.userTeams.set(teamList.teams || []);

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
    this.userTeams.set([]);

    localStorage.removeItem('isAuthenticated');
  }

  /** Checks if the user is an admin */
  isAdmin(): boolean {
    return this.userTeams().some((team: any) => team.name === 'admin');
  }
}
