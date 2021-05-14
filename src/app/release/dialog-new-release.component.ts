import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Release } from '@app/@shared/models/release';

@Component({
  selector: 'dialog-new-release',
  templateUrl: 'dialog-new-release.html',
})
export class DialogNewRelease implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogNewRelease>, @Inject(MAT_DIALOG_DATA) public data: Release) {}

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
}
