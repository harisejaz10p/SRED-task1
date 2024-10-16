
/**
 * User stats.
 */
export interface IUserStats {
  readonly user: string;
  readonly userId: number;
  readonly totalCommits: number;
  readonly totalPullRequests: number;
  readonly totalIssues: number;
}
