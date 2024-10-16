/**
 * User model.
 */
export interface User {
  readonly username: string;
  readonly id: string;
  readonly email: string;
  readonly avatarUrl: string;
  readonly accessToken: string;
  readonly connectedAt: Date;
}
