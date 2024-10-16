import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { DataTableService } from 'src/app/standalone/data-table/service/data-table.service';

/**
 * Checkbox cell renderer.
 * This component is used to render checkbox cell.
 */
@Component({
  selector: 'checkbox-cell',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-checkbox [checked]="params.value" (change)="onChange($event.checked)">
    </mat-checkbox>
  `
})
export class CheckboxCellRenderer implements ICellRendererAngularComp {

  //#region Private Properties
  /////////////////////////////////////////////////////////////

  private readonly dataTableService = inject(DataTableService);

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Public Properties
  /////////////////////////////////////////////////////////////

  /**
   * Cell renderer params.
   */
  public params!: ICellRendererParams;

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Overridden Methods
  /////////////////////////////////////////////////////////////

  /**
   * Ag init.
   * @param params - The cell renderer params.
   */
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  /**
   * Refresh.
   * @param params - The cell renderer params.
   * @returns - The boolean value.
   */
  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Public Methods
  /////////////////////////////////////////////////////////////

  /**
   * On change.
   * @param checked - The checked value.
   */
  onChange(checked: boolean): void {
    const field = this.params?.colDef?.field;
    if (field && this.params.data) {
      this.params.data[field] = checked;
      this.dataTableService.notifyCheckboxChange({
        id: this.params.data.id,
        organization: this.params.data.organization,
        included: checked
      });
    }

    if (this.params.api) {
      if (field) {
        this.params.api.refreshCells({ rowNodes: [this.params.node], columns: [field] });
      }
    }
  }

  /////////////////////////////////////////////////////////////
  //#endregion

}
