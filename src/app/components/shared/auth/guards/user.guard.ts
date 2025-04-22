import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';

export const userGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);

  if (!auth.loggedInUser) {
    await auth.checkAuth();
  }
  const userId = auth.loggedInUser?.$id;

  if (userId === 'admin') {
    window.location.href = '/admin';
    return false;
  }

  return true;
};
