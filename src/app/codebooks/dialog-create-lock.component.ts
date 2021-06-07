import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';
import { Logger } from '../@core/logger.service';
import { ReleaseRequest } from '@app/@shared/models/releaseRequest';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { Release } from '@app/@shared/models/release';

const log = new Logger('DialogCreateLock');

@Component({
  selector: 'dialog-create-lock',
  templateUrl: 'dialog-create-lock.html',
})
export class DialogCreateLock implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateLock>,
    @Inject(MAT_DIALOG_DATA) public data: ReleaseRequest,
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService
  ) {}

  releases: Release[];
  selectedRelease: Release;
  requests: ReleaseRequest[];
  selectedRequest: ReleaseRequest;

  ngOnInit() {
    this.apiHttpService.get(this.apiEndpointsService.getReleasesEndpoint()).subscribe(
      (resp) => {
        this.releases = resp;

        if (this.releases.length > 0) {
          this.onReleaseSelected(this.releases[0].id);
        }
      },
      (error) => {
        log.debug(error);
      }
    );
  }

  onReleaseSelected(releaseId: number) {
    this.selectedRelease = this.releases.find((r) => r.id === releaseId);

    if (this.requests && this.requests.length > 0) {
      this.requests.splice(0, this.requests.length);
    }

    this.apiHttpService.get(this.apiEndpointsService.getRequestData(releaseId)).subscribe(
      (resp) => {
        this.requests = resp;
      },
      (error) => {
        log.debug(error);
      }
    );
  }

  onRequestSelected(requestId: number) {
    this.selectedRequest = this.requests.find((r) => r.id === requestId);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
