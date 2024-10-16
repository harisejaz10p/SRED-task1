
/**
 * Interface for the Repo model
 */
export interface IRepo {
  readonly name: string;
  readonly id: number;
  readonly slug: string;
  readonly organization: string;
  readonly included: boolean;
  readonly userLogin: string;
  readonly html_url: string;
}
