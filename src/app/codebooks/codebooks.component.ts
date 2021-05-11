import { Component, OnInit } from '@angular/core';

import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { Logger } from '@core';
import { Codebook } from '@shared/models/Codebook';
import { CodebookDetail } from '@app/@shared/models/codebookDetail';
import { CodebookDetailWithData } from '@app/@shared/models/codebookDetailWithData';

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
  lockState: string = 'unlock';
  modela = 1;
  model = {
    left: true,
    middle: false,
    right: false,
  };

  constructor(private apiHttpService: ApiHttpService, private apiEndpointsService: ApiEndpointsService) {}

  ngOnInit(): void {
    this.apiHttpService.get(this.apiEndpointsService.getCodebooksEndpoint()).subscribe(
      (resp) => {
        this.codeboooks = resp;
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
    let codebookName: string = e.target.value;
    console.log('the selected codebook is ' + codebookName);

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
}
