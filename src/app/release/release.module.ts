import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { ReleaseRoutingModule } from './release-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ReleaseComponent } from './release.component';

//import { ToastComponent } from '@shared/toast/toast.component';
//import { ToastsContainer } from './toasts-container.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    ReleaseRoutingModule,
    DataTablesModule,
    FormsModule,
    MatTableModule,
  ],
  declarations: [ReleaseComponent],
})
export class ReleaseModule {}
