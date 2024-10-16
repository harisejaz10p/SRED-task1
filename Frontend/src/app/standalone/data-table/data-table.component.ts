import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { CheckboxCellRenderer } from 'src/app/standalone/data-table/cell/checkbox-cell-editor.component';

/**
 * Data table component.
 * This component is used to render data table.
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    CheckboxCellRenderer
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {

  //#region Angular Inputs
  /////////////////////////////////////////////////////////////

  /**
   * Column definitions.
   */
  @Input() columnDefs: ColDef[] = [];

  /**
   * Row data.
   */
  @Input() rowData: any[] = [];

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Public Properties
  /////////////////////////////////////////////////////////////

  /**
   * Default column definition.
   */
  readonly defaultColDef: ColDef = {
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
  };

  /**
   * Grid options.
   */
  readonly gridOptions: GridOptions = {
    rowSelection: "single",
  };

  /////////////////////////////////////////////////////////////
  //#endregion

}
