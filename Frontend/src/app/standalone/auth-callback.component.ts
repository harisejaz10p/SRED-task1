import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { UserAuthenticatedService } from "src/app/core/services/user-authenticated.service";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Auth callback component.
 * This component is the callback page of the application.
 */
@Component({
  standalone: true,
  imports: [
    RouterModule,
    MatProgressSpinnerModule
  ],
  template: `
    <mat-spinner></mat-spinner>
    <p>Authenticating...</p>
    `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
    };
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthCallBackComponent implements OnInit {

  //#region Private Properties
  /////////////////////////////////////////////////////////////

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly userAuthenticatedService = inject(UserAuthenticatedService);

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Angular LifeCycle  methods
  /////////////////////////////////////////////////////////////

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const token = params['access_token'];
      console.log(token, "token");

      if (!token) {
        this.router.navigate(['/home']);
        return;
      }
      this.userAuthenticatedService.setUserToken(token)
      this.userAuthenticatedService.setUserSummary(null);
      this.router.navigate(['/home']);
    });
  }

  /////////////////////////////////////////////////////////////
  //#endregion

}
