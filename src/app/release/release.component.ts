import { Component, OnInit } from '@angular/core';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { Logger } from '@core';
import { Release } from '@app/@shared/models/release';
import { ReleaseRequest } from '@app/@shared/models/releaseRequest';

const log = new Logger('Release');

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.scss'],
})
export class ReleaseComponent implements OnInit {
  releases: Release[];
  requests: ReleaseRequest[];
  releaseDisplayedColumns: string[] = ['id', 'name', 'date', 'version', 'status'];
  requestDisplayedColumns: string[] = ['id', 'name', 'sequenceNumber', 'description', 'status'];
  constructor(private apiHttpService: ApiHttpService, private apiEndpointsService: ApiEndpointsService) {}

  ngOnInit(): void {
    this.apiHttpService.get(this.apiEndpointsService.getReleasesEndpoint()).subscribe(
      (resp) => {
        this.releases = resp;
      },
      (error) => {
        log.debug(error);
      }
    );
  }

  onReleaseSelected(release: Release) {
    this.apiHttpService.get(this.apiEndpointsService.getRequestData(release.id)).subscribe(
      (resp) => {
        this.requests = resp;
      },
      (error) => {
        log.debug(error);
      }
    );
  }

  onRequestSelected(request: ReleaseRequest) {
    log.debug(request.id);
  }
}
