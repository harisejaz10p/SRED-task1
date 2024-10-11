import { inject, Injectable, } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "src/app/core/models/user.model";

/**
 * User authenticated service.
 * This service is used to manage user authenticated.
 */
@Injectable({
  providedIn: 'root',
})
export class UserAuthenticatedService {

  //#region Private Properties
  /////////////////////////////////////////////////////////////

  private readonly userSubject = new BehaviorSubject<User | null>(null);

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Public Properties
  /////////////////////////////////////////////////////////////

  /**
   * Gets current user summary.
   */
  readonly user$ = this.userSubject.asObservable();

  /**
   * Gets current user.
   */
  get user(): User | null {
    return this.userSubject.value;
  }

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Public Methods
  /////////////////////////////////////////////////////////////

  /**
   * Set current user.
   * @param userSummary - User summary @{@link User}
   */
  setUserSummary(userSummary: User | null): void {
    this.userSubject.next(userSummary);
  }

  /**
   * Set user token.
   * @param token - Token
   */
  setUserToken(token: string | null): void {
    console.log(token, "token");
    if (!token) {
      return;
    }
    localStorage.setItem('token', token);
  }

  /**
   * Gets user token.
   * @returns Token.
   */
  getToken(): string | null {
    return localStorage.getItem('token')
  }

  /**
   * Remove user token.
   */
  removeToken(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  /////////////////////////////////////////////////////////////
  //#endregion

}
