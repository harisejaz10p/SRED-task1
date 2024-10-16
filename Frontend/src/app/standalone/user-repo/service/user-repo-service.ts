import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { REPO_CHANGE_INCLUDE_ENDPOINT, REPO_DATA_ENDPOINT, REPO_ENDPOINT } from 'src/app/shared/constants';
import { RepoDataResponse } from 'src/app/standalone/user-repo/model/repo-data.model';
import { IRepo } from 'src/app/standalone/user-repo/model/repo.model';
import { IUserStats } from 'src/app/standalone/user-repo/model/user-stats.model';

/**
 * User repo service.
 * This service is used to manage home settings.
 */
@Injectable()
export class UserRepoService {
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
  getAllRepos(): Observable<readonly IRepo[]> {
    return this.apiService.get<readonly IRepo[]>(REPO_ENDPOINT);
  }

  /**
   * Get all repos data.
   * @returns
   */
  getAllReposData(): Observable<readonly RepoDataResponse[]> {
    return this.apiService.get<readonly RepoDataResponse[]>(REPO_DATA_ENDPOINT);
  }

  /**
   * Change included repo.
   * @param args - The args.
   * @returns The observable.
   */
  changeIncludedRepo(args: {
    id: number;
    organization: string;
    included: boolean;
  }): Observable<void> {
    return this.apiService.patch<void>(`${REPO_CHANGE_INCLUDE_ENDPOINT}/${args.id}`, args);
  }

  /////////////////////////////////////////////////////////////
  //#endregion

}

/**
 * Calculate repo stats by user.
 * @param repoData - The repo data.
 * @returns The user stats.
 */
export function calculateRepoStatsByUser(
  repoData: readonly RepoDataResponse[]
): readonly IUserStats[] {
  const userStatsMap: {
    [key: string]: {
      user: string;
      userId: number;
      totalCommits: number;
      totalPullRequests: number;
      totalIssues: number;
    };
  } = {};

  repoData.forEach((data) => {
    data.commits.forEach((commit) => {
      const user = commit.author;
      if (user) {
        if (!userStatsMap[user.login]) {
          userStatsMap[user.login] = {
            user: user.login,
            totalCommits: 0,
            totalPullRequests: 0,
            totalIssues: 0,
            userId: user.id,
          };
        }
        userStatsMap[user.login].totalCommits += 1;
      }
    });

    // Process pull requests and aggregate totals by user
    data.pullRequests.forEach((pr) => {
      pr.requested_reviewers.forEach((reviewer) => {
        if (!userStatsMap[reviewer.login]) {
          userStatsMap[reviewer.login] = {
            user: reviewer.login,
            totalCommits: 0,
            totalPullRequests: 0,
            totalIssues: 0,
            userId: reviewer.id,
          };
        }
        userStatsMap[reviewer.login].totalPullRequests += 1;
      });
    });

    // Process issues and aggregate totals by user
    data.issues.forEach((issue) => {
      const user = issue.user;
      if (user) {
        if (!userStatsMap[user.login]) {
          userStatsMap[user.login] = {
            user: user.login,
            totalCommits: 0,
            totalPullRequests: 0,
            totalIssues: 0,
            userId: user.id,
          };
        }
        userStatsMap[user.login].totalIssues += 1;
      }
    });
  });

  return Object.freeze(Object.values(userStatsMap));
}
