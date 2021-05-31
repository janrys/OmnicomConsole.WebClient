import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { ConfirmationDialogService } from '@app/services/confirmation-dialog.service';
import { ToastService } from '@app/services/toast.service';
import { Logger } from '../@core/logger.service';
import { Release } from '@app/@shared/models/release';
import { ReleaseRequest } from '@app/@shared/models/releaseRequest';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewRelease } from './dialog-new-release.component';
import { DialogNewRequest } from './dialog-new-request.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

const log = new Logger('Release');

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.scss'],
})
export class ReleaseComponent implements OnInit, AfterViewInit {
  releases: Release[];
  requests: ReleaseRequest[];
  selectedRelease: Release;
  releasesdataSource: MatTableDataSource<Release>;
  @ViewChild(MatSort) sort: MatSort;
  requestsdataSource: MatTableDataSource<ReleaseRequest>;
  releaseDisplayedColumns: string[] = ['id', 'name', 'date', 'version', 'status', 'actions'];
  requestDisplayedColumns: string[] = ['id', 'name', 'sequenceNumber', 'description', 'status', 'actions'];
  constructor(
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService,
    public dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.apiHttpService.get(this.apiEndpointsService.getReleasesEndpoint()).subscribe(
      (resp) => {
        this.releases = resp;
        this.releasesdataSource = new MatTableDataSource<Release>(this.releases);

        if (this.releases.length > 0) {
          this.onReleaseSelected(this.releases[0]);
        }
      },
      (error) => {
        log.debug(error);
      }
    );
  }

  ngAfterViewInit(): void {
    //this.requestsdataSource.sort = this.sort;
  }

  onReleaseSelected(release: Release) {
    this.selectedRelease = release;
    this.apiHttpService.get(this.apiEndpointsService.getRequestData(this.selectedRelease.id)).subscribe(
      (resp) => {
        this.requests = resp;
        this.requestsdataSource = new MatTableDataSource<ReleaseRequest>(this.requests);
      },
      (error) => {
        log.debug(error);
      }
    );
  }

  onRequestSelected(request: ReleaseRequest) {
    log.debug(request.id);
  }

  addRelease() {
    let addedRelease: Release = {
      id: -1,
      name: 'release name',
      date: new Date(),
      status: 'Nový',
      version: '1',
    };

    let dialogRef = this.dialog.open(DialogNewRelease, {
      width: '250px',
      data: addedRelease,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.apiHttpService.post(this.apiEndpointsService.postReleaseEndpoint(), result).subscribe(
        (resp) => {
          this.releases.push(resp);
          this.releasesdataSource.data = this.releases;
          this.requestsdataSource.data = this.requests;
          this.showSuccess('Release inserted', `Release with id ${resp.id} was inserted`);
        },
        (error) => {
          this.showError('Insert failed', `Release insert failed with error ${error.message} ${error.error.title}`);
          log.debug(error);
        }
      );
    });
  }

  editRelease(editRelease: Release) {
    let dialogRef = this.dialog.open(DialogNewRelease, {
      width: '250px',
      data: editRelease,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.apiHttpService.put(this.apiEndpointsService.putReleaseEndpoint(), result).subscribe(
        (resp) => {
          var index = this.releases.findIndex((x) => x.id == resp.id);
          this.releases[index] = resp;
          this.releasesdataSource.data = this.releases;
          this.showSuccess('Release updated', `Release with id ${resp.id} was updated`);
        },
        (error) => {
          this.showError(
            'Update failed',
            `Release update with id ${result.id} failed with error ${error.message} ${error.error.title}`
          );
          log.debug(error);
        }
      );
    });
  }

  deleteRelease(id: number) {
    this.confirmationDialogService
      .confirm('Request delete', 'Are you sure you want to delete release with all requests?')
      .then((confirmed) => {
        if (confirmed) {
          this.apiHttpService.delete(this.apiEndpointsService.deleteReleaseByIdEndpoint(id)).subscribe(
            (resp) => {
              var index = this.releases.findIndex((x) => x.id == id);
              this.releases.splice(index, 1);
              this.releasesdataSource.data = this.releases;
              this.showSuccess('Release', `Release with id ${id} was deleted`);
              log.debug('onDelete: ', id);
            },
            (error) => {
              this.showError(
                'Delete failed',
                `Request delete with id ${id} failed with error ${error.message} ${error.error.title}`
              );
              log.debug('onDelete: ', error);
            }
          );
        }
      })
      .catch(() => {
        log.debug('onDelete: ', 'Cancel');
      });
  }

  addRequest() {
    let addedRequest: ReleaseRequest = {
      id: -1,
      releaseId: this.selectedRelease.id,
      name: 'request name',
      sequenceNumber: 1,
      description: '',
      status: 'Nový',
    };

    let dialogRef = this.dialog.open(DialogNewRequest, {
      width: '250px',
      data: addedRequest,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.apiHttpService.post(this.apiEndpointsService.postRequestEndpoint(), result).subscribe(
        (resp) => {
          this.requests.push(resp);
          this.requestsdataSource.data = this.requests;
          this.showSuccess('Request inserted', `Request inserted with id ${resp.id}`);
        },
        (error) => {
          this.showError(
            'Insert failed',
            `Request insert with name ${result.name} failed with error ${error.message} ${error.error.title}`
          );
          log.debug(error);
        }
      );
    });
  }

  editRequest(editRequest: ReleaseRequest) {
    let dialogRef = this.dialog.open(DialogNewRequest, {
      width: '250px',
      data: editRequest,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.apiHttpService.put(this.apiEndpointsService.putRequestEndpoint(), result).subscribe(
        (resp) => {
          var index = this.requests.findIndex((x) => x.id == resp.id);
          this.requests[index] = resp;
          this.requestsdataSource.data = this.requests;
          this.showSuccess('Request updated', `Request with id ${resp.id} was updated`);
        },
        (error) => {
          this.showError(
            'Update failed',
            `Request update with id ${result.id} failed with error ${error.message} ${error.error.title}`
          );
          log.debug(error);
        }
      );
    });
  }

  deleteRequest(id: number) {
    this.confirmationDialogService
      .confirm('Request delete', 'Are you sure you want to delete request?')
      .then((confirmed) => {
        if (confirmed) {
          this.apiHttpService.delete(this.apiEndpointsService.deleteRequestByIdEndpoint(id)).subscribe(
            (resp) => {
              var index = this.requests.findIndex((x) => x.id == id);
              this.requests.splice(index, 1);
              this.requestsdataSource.data = this.requests;
              this.showSuccess('Request deleted', `Request with id ${id} was deleted`);
              log.debug('onDelete: ', id);
            },
            (error) => {
              this.showError(
                'Delete failed',
                `Request delete with id ${id} failed with error ${error.message} ${error.error.title}`
              );
              log.debug('onDelete: ', error);
            }
          );
        }
      })
      .catch(() => {
        log.debug('onDelete: ', 'Cancel');
      });
  }

  showSuccess(headerText: string, bodyText: string) {
    this.toastService.show(bodyText, {
      classname: 'bg-success text-light',
      delay: 2000,
      autohide: true,
      headertext: headerText,
    });
  }

  showError(headerText: string, bodyText: string) {
    this.toastService.show(bodyText, {
      classname: 'bg-danger text-light',
      delay: 2000,
      autohide: true,
      headertext: headerText,
    });
  }
}
