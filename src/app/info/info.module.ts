import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { InfoRoutingModule } from './info-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { InfoComponent } from './info.component';

//import { ToastComponent } from '@shared/toast/toast.component';
//import { ToastsContainer } from './toasts-container.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    InfoRoutingModule,
    DataTablesModule,
    FormsModule,
    MatTableModule,
  ],
  declarations: [InfoComponent],
})
export class InfoModule {}
