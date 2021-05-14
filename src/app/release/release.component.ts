import { Component, OnInit } from '@angular/core';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { Logger } from '@core';
import { Release } from '@app/@shared/models/release';
import { ReleaseRequest } from '@app/@shared/models/releaseRequest';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewRelease } from './dialog-new-release.component';
import { MatTableDataSource } from '@angular/material/table';

const log = new Logger('Release');

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.scss'],
})
export class ReleaseComponent implements OnInit {
  releases: Release[];
  requests: ReleaseRequest[];
  releasesdataSource: MatTableDataSource<Release>;
  requestsdataSource: MatTableDataSource<ReleaseRequest>;
  releaseDisplayedColumns: string[] = ['id', 'name', 'date', 'version', 'status'];
  requestDisplayedColumns: string[] = ['id', 'name', 'sequenceNumber', 'description', 'status'];
  constructor(
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.apiHttpService.get(this.apiEndpointsService.getReleasesEndpoint()).subscribe(
      (resp) => {
        this.releases = resp;
        this.releasesdataSource = new MatTableDataSource<Release>(this.releases);
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
      id: 1,
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
      this.releases.push(result);
      this.releasesdataSource = new MatTableDataSource<Release>(this.releases);
    });
  }
}
