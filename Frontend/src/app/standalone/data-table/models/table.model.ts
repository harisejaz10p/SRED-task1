import { ColDef } from "ag-grid-community";
import { CheckboxCellRenderer } from "src/app/standalone/data-table/cell/checkbox-cell-editor.component";

/**
 * Repository stats table column definitions.
 */
export const REPO_STATS_TABLE_COLUMN_DEFS: readonly ColDef[] = Object.freeze([
  {
    headerName: 'User',
    field: 'user',
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    headerName: 'UserId',
    field: 'userId',
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    headerName: 'Total Commits',
    field: 'totalCommits',
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    headerName: 'Total Pull Requests',
    field: 'totalPullRequests',
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  },
  {
    headerName: 'Total Issues',
    field: 'totalIssues',
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  },
]);

/**
 * Repository table column definitions.
 */
export const REPO_TABLE_COL_DEF: readonly ColDef[] = Object.freeze([
  {
    headerName: 'Id',
    field: 'id',
    resizable: true,
    flex: 1,
  },
  {
    headerName: 'Name',
    field: 'name',
    resizable: true,
    flex: 1,
  },
  {
    headerName: 'Link',
    field: 'html_url',
    resizable: true,
    flex: 1,
  },
  {
    headerName: 'Slug',
    field: 'slug',
    resizable: true,
    flex: 1,
  },
  {
    headerName: 'Included',
    field: 'included',
    cellRendererFramework: CheckboxCellRenderer,
    flex: 1,
  }
])
