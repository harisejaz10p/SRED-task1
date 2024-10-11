import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserAuthenticatedService } from 'src/app/core/services/user-authenticated.service';

/**
 * Auth interceptor.
 * @param req - request
 * @param next - next middleware
 * @returns clone request
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userAuthenticatedService = inject(UserAuthenticatedService);
  const token = userAuthenticatedService.getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
