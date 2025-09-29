import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  console.log('Not Authenticated Guard');

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const isAuthenticated: boolean = await firstValueFrom(authService.checkStatus());

  if (isAuthenticated) {
    router.navigate(['/']);
    return false;
  }

  return true;
}
