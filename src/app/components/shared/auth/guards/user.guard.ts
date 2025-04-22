import { CanActivateFn } from '@angular/router';

export const userGuard: CanActivateFn = (route, state) => {
  const userRole = 'user';

  if (userRole !== 'user') {
    window.location.href = '/admin';
    return false;
  }

  return true;
};
