import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../../../store/auth.store';

export const authGuard: CanActivateFn = async (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  
  if (!authStore.isAuthenticated()) {
    await authStore.initAuth();
  }

  if (!authStore.isAuthenticated()) {
    router.navigate(['/auth']);
    return false;
  }
  
  return true;
};

export const adminGuard: CanActivateFn = async (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  
  if (!authStore.isAuthenticated()) {
    await authStore.initAuth();
  }

  if (!authStore.isAuthenticated()) {
    router.navigate(['/auth']);
    return false;
  }
  
  if (!authStore.isAdmin()) {
    router.navigate(['/profile']);
    return false;
  }
  
  return true;
};

export const userGuard: CanActivateFn = async (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  
  if (!authStore.isAuthenticated()) {
    await authStore.initAuth();
  }

  if (!authStore.isAuthenticated()) {
    router.navigate(['/auth']);
    return false;
  }
  
  if (authStore.isAdmin()) {
    router.navigate(['/admin']);
    return false;
  }
  
  return true;
};