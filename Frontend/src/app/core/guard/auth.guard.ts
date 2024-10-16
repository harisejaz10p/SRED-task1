import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserAuthenticatedService } from 'src/app/core/services/user-authenticated.service';
import { HomeService } from 'src/app/modules/home/services/home.service';

/**
 * Auth guard.
 * @param route - route
 * @param state - state
 * @returns boolean
 */
export const authGuard: CanActivateFn = (route, state) => {
  const userAuthenticatedService = inject(UserAuthenticatedService);
  const currentUser = userAuthenticatedService.user
  const authToken = userAuthenticatedService.getToken();
  const homeService = inject(HomeService);

  if (authToken == null) {
    return of(true);
  }

  if (currentUser != null) {
    return of(true);
  }

  return homeService.identify().pipe(
    map((data) => {
      userAuthenticatedService.setUserSummary(data);
      return true;
    }),
    catchError(() => {
      return of(true);
    })
  );
};
