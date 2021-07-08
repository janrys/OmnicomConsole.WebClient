import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { saveAs } from 'file-saver';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Release } from '@app/@shared/models/release';
import { ReleaseRequest, ReleaseRequestInstance } from '@app/@shared/models/releaseRequest';
import { UserService } from '@app/services/user-service';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { ToastService } from '@app/services/toast.service';
import { Logger } from '../@core/logger.service';

const log = new Logger('Export');

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements OnInit {
  isExportAllowed: boolean;
  showJustApprovedRequests: boolean;
  releases: Release[];
  requests: ReleaseRequest[];
  selectedRelease: Release;
  requestsdataSource: MatTableDataSource<ReleaseRequest>;
  selection = new SelectionModel<any>(true, []);
  requestDisplayedColumns: string[] = ['select', 'id', 'name', 'sequenceNumber', 'description', 'status'];

  constructor(
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService,
    private userService: UserService,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.isExportAllowed = this.userService.getIsExportAllowed();

    this.apiHttpService.get(this.apiEndpointsService.getReleasesEndpoint()).subscribe(
      (resp) => {
        this.releases = resp;

        // if (this.releases.length > 0) {
        //   this.releaseSelected(this.releases[0]);
        // }
      },
      (error) => {
        log.debug(error);
      }
    );
  }

  onReleaseSelected(releaseId: string) {
    let releaseIdParsed: number = parseInt(releaseId);

    let release = this.releases.find((r) => r.id === releaseIdParsed);
    this.releaseSelected(release);
  }

  onShowApprovedRequests(event: MatCheckboxChange) {
    this.releaseSelected(this.selectedRelease);
  }

  releaseSelected(release: Release) {
    this.selectedRelease = release;
    this.refreshRequestData(release.id, this.showJustApprovedRequests ? ReleaseRequestInstance.statusApproved : '');
  }

  refreshRequestData(releaseId: number, releaseRequestStatus: string) {
    this.apiHttpService
      .get(this.apiEndpointsService.getRequestWithStatusData([releaseId], releaseRequestStatus))
      .subscribe(
        (resp) => {
          this.requests = resp;
          this.requestsdataSource = new MatTableDataSource<ReleaseRequest>(this.requests);
        },
        (error) => {
          log.debug(error);
        }
      );
  }

  export() {
    if (this.selection.selected.length === 0) {
      return;
    }

    this.apiHttpService
      .postDownloadFile(
        this.apiEndpointsService.getExportPackageEndpoint(),
        this.selection.selected.map((r) => r.id)
      )
      .subscribe(
        (resp: any) => {
          let fileName: string = this.getFileNameFromHttpResponse(resp);
          saveAs(resp.body, fileName);
        },
        (error: any) => {
          log.debug(error);
        }
      );
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.requestsdataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.requestsdataSource.data.forEach((row) => this.selection.select(row));
  }

  getFileNameFromHttpResponse(httpResponse: any): string {
    const contentDispositionHeader = httpResponse.headers.get('Content-Disposition');
    const splited = contentDispositionHeader.split(';');
    let result = splited[1].trim().split('=')[1];
    if (splited.length > 2) {
      const splitedEncoded = splited[2].trim().split('=')[1].split("'");
      result = decodeURIComponent(splitedEncoded[splitedEncoded.length - 1]);
    }
    return result.replace(/"/g, '');
  }
}
