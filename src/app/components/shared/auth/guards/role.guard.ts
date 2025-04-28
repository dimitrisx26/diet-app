import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../../../services/auth/auth.service";

export function roleGuard(requiredRole: 'admin' | ''): CanActivateFn {
  return async (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    
    const url = state.url;
    
    if (requiredRole === 'admin' && url.includes('/admin')) {
      return true;
    }
    
    if (requiredRole === '' && (url === '/profile' || !url.includes('/admin'))) {
      return true;
    }
    
    await auth.checkAuth();
    const isAdmin = await auth.isAdmin();
    
    if (requiredRole === 'admin' && !isAdmin) {
      router.navigate(['/profile']);
      return false;
    }

    if (requiredRole === '' && isAdmin) {
      router.navigate(['/admin']);
      return false;
    }

    return true;
  };
}