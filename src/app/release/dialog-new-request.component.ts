import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ReleaseRequest } from '@app/@shared/models/releaseRequest';

@Component({
  selector: 'dialog-new-request',
  templateUrl: 'dialog-new-request.html',
})
export class DialogNewRequest implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogNewRequest>, @Inject(MAT_DIALOG_DATA) public data: ReleaseRequest) {}

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
