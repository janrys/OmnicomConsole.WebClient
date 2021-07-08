import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PackageInfo } from '@app/@shared/models/packageInfo';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { ApiHttpService } from '@app/services/api-http.service';
import { ToastService } from '@app/services/toast.service';
import { UserService } from '@app/services/user-service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Logger } from '../@core/logger.service';

const log = new Logger('Import');

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  isImportAllowed: boolean;
  lastPackage: PackageInfo = { packageNumber: 0 };
  fileToUpload: File = null;

  constructor(
    private userService: UserService,
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.isImportAllowed = this.userService.getIsImportAllowed();

    this.apiHttpService.get(this.apiEndpointsService.getLastPackageEndpoint()).subscribe(
      (resp) => {
        this.lastPackage = resp;
      },
      (error) => {
        log.debug(error);
      }
    );
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  postFile() {
    if (!this.fileToUpload) {
      return of(false);
    }

    const formData: FormData = new FormData();
    formData.append('packageFile', this.fileToUpload, this.fileToUpload.name);
    const headers = new HttpHeaders().append('Content-Disposition', 'mulipart/form-data');
    this.apiHttpService
      .post(this.apiEndpointsService.postImportPackageEndpoint(), formData, { headers: headers })
      .subscribe(
        (resp) => {
          this.toastService.showSuccess('Package uploaded', `Package ${this.fileToUpload.name} was uploaded`);
        },
        (error) => {
          this.toastService.showError(
            'Package upload failed',
            `Package upload failed with error ${error.message} ${error.error?.title ?? ''}`
          );
          log.debug(error);
        }
      );
  }
}
