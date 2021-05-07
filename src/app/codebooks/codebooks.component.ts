import { Component, OnInit } from '@angular/core';

import { Codebook } from '@shared/models/Codebook';
import { DataTablesResponse } from '@shared/classes/data-tables-response';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { Logger } from '@core';

const log = new Logger('Codebooks');

@Component({
  selector: 'app-codebooks',
  templateUrl: './codebooks.component.html',
  styleUrls: ['./codebooks.component.scss'],
})
export class CodebooksComponent implements OnInit {
  codeboooks: Codebook[];

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
}
