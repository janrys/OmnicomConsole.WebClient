import { Component, OnInit } from '@angular/core';

import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { Logger } from '@core';
import { Codebook } from '@shared/models/Codebook';
import { CodebookDetailWithData } from '@app/@shared/models/codebookDetailWithData';
import { LockState } from '@app/@shared/models/lockState';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UserMe } from '@app/@shared/models/UserMe';
import { UserService } from '@app/services/user-service';
import { ToastService } from '@app/services/toast.service';
import { ApplicationMetadata } from '@app/@shared/models/applicationMetadata';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmationDialogService } from '@app/services/confirmation-dialog.service';
import { RecordChange } from '@app/@shared/models/recordChange';

const log = new Logger('Codebooks');

@Component({
  selector: 'app-codebooks',
  templateUrl: './codebooks.component.html',
  styleUrls: ['./codebooks.component.scss'],
})
export class CodebooksComponent implements OnInit {
  codeboooks: Codebook[];
  codebookDetailWithData: CodebookDetailWithData;
  codebookdataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  columns: string[];
  displayColumns: string[];
  lockState: LockState = { isLocked: true, forUserId: '', forUserName: '', created: new Date(), forReleaseId: 0 };
  modela = 1;
  showRds: boolean = false;
  currentUser: UserMe = {
    name: '',
    identifier: '',
    upn: '',
    roles: [''],
    accessTokenExpiration: new Date(),
    refreshTokenExpiration: new Date(),
    idTokenExpiration: new Date(),
  };
  applicationMetadata: ApplicationMetadata;
  isReadOnly: boolean;
  model = {
    left: true,
    middle: false,
    right: false,
  };

  constructor(
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService,
    private userService: UserService,
    public toastService: ToastService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.apiHttpService.get(this.apiEndpointsService.getCodebooksEndpointWithRds(this.showRds)).subscribe(
      (resp) => {
        this.codeboooks = resp;
      },
      (error) => {
        log.debug(error);
      }
    );

    this.userService.getMe().subscribe((data) => {
      this.currentUser = data as UserMe;
    });

    this.apiHttpService.get(this.apiEndpointsService.getMetadataEndpoint()).subscribe(
      (resp) => {
        this.applicationMetadata = resp;
        this.isReadOnly = this.applicationMetadata.mode === 'read_only';
      },
      (error) => {
        log.debug(error);
      }
    );

    this.apiHttpService.get(this.apiEndpointsService.getLockStateEndpoint()).subscribe(
      (resp) => {
        this.lockState = resp;
      },
      (error) => {
        log.debug(error);
      }
    );
  }

  encodeSpecialCharacters(uri: string): string {
    return decodeURIComponent(uri);
  }

  onCodebookSelected(e: Event) {
    let element = e.target as HTMLSelectElement;
    let codebookName: string = element.value;

    this.apiHttpService.get(this.apiEndpointsService.getCodebookData(codebookName)).subscribe(
      (resp) => {
        this.codebookDetailWithData = resp;
        this.selection.clear();
        this.codebookdataSource = new MatTableDataSource<any>(this.codebookDetailWithData.data);
        this.columns = Object.keys(this.codebookDetailWithData.data[0]);
        this.displayColumns = Object.keys(this.codebookDetailWithData.data[0]);

        if (!this.isReadOnly && this.codebookDetailWithData.isEditable) {
          this.displayColumns.unshift('select');
        }
      },
      (error) => {
        log.debug(error);
      }
    );
  }

  onShowRdsChange(event: MatCheckboxChange) {
    this.apiHttpService.get(this.apiEndpointsService.getCodebooksEndpointWithRds(event.checked)).subscribe(
      (resp) => {
        this.codeboooks = resp;
      },
      (error) => {
        log.debug(error);
      }
    );
  }

  createLock() {
    this.apiHttpService.post(this.apiEndpointsService.createLockEndpoint(), []).subscribe(
      (resp) => {
        this.lockState = resp;
        this.showSuccess(
          'Lock created',
          `Lock created for current user ${resp.forUserName} for release id ${resp.forReleaseId}`
        );
      },
      (error) => {
        this.showError('Lock failed', `Cannot create lock because ${error.message} ${error.error.title}`);
        log.debug(error);
      }
    );
  }

  releaseLock() {
    this.apiHttpService.delete(this.apiEndpointsService.releaseLockEndpoint()).subscribe(
      (resp) => {
        this.lockState = resp;
        this.showSuccess('Lock released', `Lock has been released`);
      },
      (error) => {
        this.showError('Lock release failed', `Lock release failed because ${error.message} ${error.error.title}`);
        log.debug(error);
      }
    );
  }

  addRecord() {
    if (!this.codebookDetailWithData.isEditable) {
      return;
    }
  }

  editRecord() {
    if (!this.codebookDetailWithData.isEditable || this.selection.selected.length !== 1) {
      return;
    }
  }

  copyRecord() {
    if (!this.codebookDetailWithData.isEditable || this.selection.selected.length !== 1) {
      return;
    }
  }

  removeRecord() {
    if (!this.codebookDetailWithData.isEditable || this.selection.selected.length === 0) {
      return;
    }

    this.confirmationDialogService
      .confirm('Delete records', `Delete ${this.selection.selected.length} record(s)?`)
      .then((confirmed) => {
        if (confirmed) {
          let recordChanges: RecordChange[] = [];

          let keyColumnName = this.getKeyColumnName();

          if (!keyColumnName) {
            this.showError('Delete failed', `Cannot fing primary key column`);

            return;
          }

          this.selection.selected.forEach(function (record) {
            let newRecordChange: RecordChange = {
              operation: 'delete',
              recordKey: { key: keyColumnName, value: record[keyColumnName] },
              recordChanges: null,
            };
            recordChanges.push(newRecordChange);
          });

          this.apiHttpService
            .put(
              this.apiEndpointsService.getCodebookDataChangeEndpoint(this.codebookDetailWithData.name),
              recordChanges
            )
            .subscribe(
              (resp) => {
                this.selection.selected.forEach(function (record: any) {
                  let index: number = this.codebookDetailWithData.data.findIndex((d: any) => d === record);
                  this.codebookDetailWithData.data.splice(index, 1);
                }, this);

                this.codebookdataSource.data = this.codebookDetailWithData.data;
                this.showSuccess('Records deleted', `${this.selection.selected.length} record(s) were deleted`);
                log.debug('onDelete: ', this.selection.selected.length);
                this.selection.clear();
              },
              (error) => {
                this.showError(
                  'Delete failed',
                  `Deletion of records failed with error ${error.message} ${error.error.title}`
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

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.codebookdataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.codebookdataSource.data.forEach((row) => this.selection.select(row));
  }

  getKeyColumnName(): string {
    return this.codebookDetailWithData.columns.find((c) => c.isPrimaryKey)?.name;
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
