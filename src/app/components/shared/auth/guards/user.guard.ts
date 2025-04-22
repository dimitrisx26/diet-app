import { CanActivateFn } from '@angular/router';

export const userGuard: CanActivateFn = (route, state) => {
  const userRole = localStorage.getItem('userRole');

  if (userRole !== 'user') {
    window.location.href = '/admin/users';
    return false;
  }

  return true;
};
