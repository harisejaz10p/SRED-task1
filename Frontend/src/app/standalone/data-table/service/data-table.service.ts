import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

/**
 * Data table service.
 * This service is used to data table.
 */
@Injectable()
export class DataTableService {

  //#region Private Properties
  /////////////////////////////////////////////////////////////

  private readonly checkboxChangeSubject = new Subject<CheckboxChange>();

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Public Properties
  /////////////////////////////////////////////////////////////

  /**
   * Checkbox change observable.
   */
  readonly checkboxChange$ = this.checkboxChangeSubject.asObservable();

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Public Methods
  /////////////////////////////////////////////////////////////

  /**
   * Notify checkbox change.
   * @param checkboxChange - The checkbox change.
   */
  notifyCheckboxChange(checkboxChange: CheckboxChange): void {
    this.checkboxChangeSubject.next(checkboxChange);
  }

  /////////////////////////////////////////////////////////////
  //#endregion

}

//#region Internal Region
/////////////////////////////////////////////////////////////

interface CheckboxChange {
  readonly id: number;
  readonly organization: string;
  readonly included: boolean;
}

/////////////////////////////////////////////////////////////
//#endregion
