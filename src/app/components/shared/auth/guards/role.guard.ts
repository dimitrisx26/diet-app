import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';

export function roleGuard(requiredRole: 'admin' | ''): CanActivateFn {
  return async (route, state) => {
    const auth = inject(AuthService);

    await auth.checkAuth();

    const isAdmin = auth.isAdmin();

    if (requiredRole === 'admin' && !isAdmin) {
      window.location.href = '/profile';
      return false;
    }

    if (requiredRole === '' && isAdmin) {
      window.location.href = '/admin';
      return false;
    }

    return true;
  };
}