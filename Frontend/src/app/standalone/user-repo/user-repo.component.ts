import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColDef } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import { DataTableComponent } from 'src/app/standalone/data-table/data-table.component';
import { REPO_STATS_TABLE_COLUMN_DEFS, REPO_TABLE_COL_DEF } from 'src/app/standalone/data-table/models/table.model';
import { DataTableService } from 'src/app/standalone/data-table/service/data-table.service';
import { IRepo } from 'src/app/standalone/user-repo/model/repo.model';
import { IUserStats } from 'src/app/standalone/user-repo/model/user-stats.model';
import { calculateRepoStatsByUser, UserRepoService } from 'src/app/standalone/user-repo/service/user-repo-service';

/**
 * User repo component.
 */
@Component({
  selector: 'app-user-repo',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    DataTableComponent
  ],
  templateUrl: './user-repo.component.html',
  styleUrls: ['./user-repo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserRepoService, DataTableService],
})
export class UserRepoComponent implements OnInit, OnDestroy {

  //#region Private Properties
  /////////////////////////////////////////////////////////////

  private readonly userRepoService = inject(UserRepoService);
  private readonly dataTableService = inject(DataTableService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Public Properties
  /////////////////////////////////////////////////////////////

  /**
   * Is user repo loading.
   */
  isUserRepoLoading = true;

  /**
   * Is user stats loading.
   */
  isUserStatsLoading = true;

  /**
   * User repos.
   */
  userRepos: IRepo[] = [];

  /**
   * User stats.
   */
  userStats: IUserStats[] = [];

  /**
   * Gets user repo column definition.
   */
  get userRepoColDef(): ColDef[] {
    return [...REPO_TABLE_COL_DEF];
  }

  /**
   * Gets user stats column definition.
   */
  get userStatsDef(): ColDef[] {
    return [...REPO_STATS_TABLE_COLUMN_DEFS];
  }

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Angular LifeCycle  methods
  /////////////////////////////////////////////////////////////

  ngOnInit(): void {
    this.getUserRepos();
    this.handleCheckboxChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Private Methods
  /////////////////////////////////////////////////////////////

  private handleCheckboxChange(): void {
    this.dataTableService.checkboxChange$.pipe(takeUntil(this.destroy$)).
      subscribe({
        next: (checkboxChange) => {
          this.changeRepoIncluded(checkboxChange);
          this.cdr.markForCheck();
        }
      });
  }

  private getUserRepos(): void {
    this.isUserRepoLoading = true;
    this.userRepoService.getAllRepos().subscribe({
      next: (response) => {
        this.userRepos = [...response];
        this.getUserStats();
        this.isUserRepoLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error(error);
        this.cdr.markForCheck();
      }
    });
  }

  private getUserStats(): void {
    this.isUserStatsLoading = true;
    this.userRepoService.getAllReposData().subscribe({
      next: (response) => {
        this.userStats = [...calculateRepoStatsByUser(response)]
        this.isUserStatsLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private changeRepoIncluded(args: {
    id: number;
    organization: string;
    included: boolean;
  }): void {
    this.userRepoService.changeIncludedRepo(args).subscribe({
      next: () => {
        this.getUserStats();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error(error);
        this.cdr.markForCheck();
      }
    });
  }

  /////////////////////////////////////////////////////////////
  //#endregion

}


