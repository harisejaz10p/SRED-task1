import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/core/models/user.model";
import { ApiService } from "src/app/core/services/api.service";
import { ConnectModel } from "src/app/modules/home/models/connect.model";
import { AUTH_ENDPOINT, IDENTITY_ENDPOINT, REMOVE_ENDPOINT } from "src/app/shared/constants";

/**
 * Home setting service.
 * This service is used to manage home settings.
 */
@Injectable({
  providedIn: 'root',
})
export class HomeService {

  //#region Private Properties
  /////////////////////////////////////////////////////////////

  private readonly apiService = inject(ApiService);

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Public Properties
  /////////////////////////////////////////////////////////////

  /**
   * Remove the session.
   */
  remove(): Observable<void> {
    return this.apiService.post<void>(REMOVE_ENDPOINT, {});
  }

  /**
   * Connects to the external service.
   */
  connect(): Observable<ConnectModel> {
    return this.apiService.get<ConnectModel>(AUTH_ENDPOINT);
  }

  /**
   * Identify the user.
   * @returns User
   */
  identify(): Observable<User> {
    return this.apiService.get<User>(IDENTITY_ENDPOINT);
  }

  /////////////////////////////////////////////////////////////
  //#endregion

}
