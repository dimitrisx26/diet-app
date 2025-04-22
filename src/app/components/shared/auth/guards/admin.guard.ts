import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const userRole = 'admin';

  if (userRole !== 'admin') {
    window.location.href = '/profile';
    return false;
  }

  return true;
};