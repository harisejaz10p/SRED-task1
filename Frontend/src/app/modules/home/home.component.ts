import { UserAuthenticatedService } from 'src/app/core/services/user-authenticated.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HomeService } from 'src/app/modules/home/services/home.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Home component.
 * This component is the home page of the application.s
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  //#region Private Properties
  /////////////////////////////////////////////////////////////

  private readonly homeService = inject(HomeService);
  private readonly userAuthenticatedService = inject(UserAuthenticatedService);
  private _snackBar = inject(MatSnackBar);


  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Public  Properties
  /////////////////////////////////////////////////////////////

  /**
   * Gets current user summary.
   */
  readonly user$ = this.userAuthenticatedService.user$;

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Public Methods
  /////////////////////////////////////////////////////////////

  /**
   * Connect to the external service.
   */
  connect(): void {
    this.homeService.connect().subscribe({
      next: (response) => {
        window.location.href = response.url;
      },
      error: (error) => {
        console.error(error);
        this._snackBar.open('Error connecting to the service', 'Close', {
          duration: 5000,
        });
      }
    });
  }

  /**
   * Remove the session.
   */
  remove(): void {
    this.homeService.remove().subscribe({
      next: () => {
        this.userAuthenticatedService.setUserSummary(null);
        this.userAuthenticatedService.removeToken();
        window.location.href = '/';
      },
      error: (error) => {
        console.error(error);
        this._snackBar.open('Error removing the session', 'Close', {
          duration: 5000,
        });
      }
    });
  }

  /////////////////////////////////////////////////////////////
  //#endregion

}
