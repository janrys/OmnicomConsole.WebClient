import { Component, OnInit } from '@angular/core';

import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { Logger } from '@core';
import { Codebook } from '@shared/models/Codebook';
import { CodebookDetail } from '@app/@shared/models/codebookDetail';
import { CodebookDetailWithData } from '@app/@shared/models/codebookDetailWithData';
import { LockState } from '@app/@shared/models/lockState';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UserMe } from '@app/@shared/models/UserMe';
import { UserService } from '@app/services/user-service';
import { ToastService } from '@app/services/toast.service';

const log = new Logger('Codebooks');

@Component({
  selector: 'app-codebooks',
  templateUrl: './codebooks.component.html',
  styleUrls: ['./codebooks.component.scss'],
})
export class CodebooksComponent implements OnInit {
  codeboooks: Codebook[];
  codeboookDetail: CodebookDetail;
  codebookDetailWithData: CodebookDetailWithData;
  columns: string[];
  lockState: LockState = undefined;
  modela = 1;
  showRds: boolean = false;
  currentUser: UserMe;
  model = {
    left: true,
    middle: false,
    right: false,
  };

  constructor(
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService,
    private userService: UserService,
    public toastService: ToastService
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

    this.apiHttpService.get(this.apiEndpointsService.getCodebookDetail(codebookName)).subscribe(
      (resp) => {
        this.codeboookDetail = resp;
      },
      (error) => {
        log.debug(error);
      }
    );

    this.apiHttpService.get(this.apiEndpointsService.getCodebookData(codebookName)).subscribe(
      (resp) => {
        this.codebookDetailWithData = resp;
        this.codeboookDetail = resp;
        this.columns = Object.keys(this.codebookDetailWithData.data[0]);
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
        this.showError('Lock failed', `Cannot create lock because ${error}`);
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
        this.showError('Lock release failed', `Lock release failed because ${error}`);
        log.debug(error);
      }
    );
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
