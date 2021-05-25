import { Component, OnInit } from '@angular/core';

import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { Logger } from '@core';
import { Codebook } from '@shared/models/Codebook';
import { CodebookDetail } from '@app/@shared/models/codebookDetail';
import { CodebookDetailWithData } from '@app/@shared/models/codebookDetailWithData';
import { LockState } from '@app/@shared/models/lockState';
import { MatCheckboxChange } from '@angular/material/checkbox';

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
  model = {
    left: true,
    middle: false,
    right: false,
  };

  constructor(private apiHttpService: ApiHttpService, private apiEndpointsService: ApiEndpointsService) {}

  ngOnInit(): void {
    this.apiHttpService.get(this.apiEndpointsService.getCodebooksEndpointWithRds(this.showRds)).subscribe(
      (resp) => {
        this.codeboooks = resp;
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
}
