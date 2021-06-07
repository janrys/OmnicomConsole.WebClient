import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Release } from '@app/@shared/models/release';
import { DialogNewcodebookDataModel } from './DialogNewcodebookDataModel';

@Component({
  selector: 'dialog-new-codebook-data',
  templateUrl: 'dialog-new-codebook-data.html',
})
export class DialogNewcodebookData implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogNewcodebookData>,
    @Inject(MAT_DIALOG_DATA) public dialogModel: DialogNewcodebookDataModel
  ) {}

  ngOnInit() {}

  /* data.id = new FormControl('', [Validators.required, Validators.email]);

      getErrorMessage() {
        if (this.data.id.hasError('required')) {
          return 'You must enter a value';
        }
    
        return this.data.id.hasError('email') ? 'Not a valid email' : '';
      } */
  onNoClick(): void {
    this.dialogRef.close();
  }

  getInputType(columnType: string): string {
    if (
      columnType.includes('int') ||
      columnType.includes('decimal') ||
      columnType.includes('bit') ||
      columnType.includes('numeric') ||
      columnType.includes('float') ||
      columnType.includes('real')
    ) {
      return 'number';
    } else if (columnType.includes('date')) {
      return 'datetime-local';
    }

    return 'text';
  }
}
