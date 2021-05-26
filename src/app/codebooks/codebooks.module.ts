import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { CodebooksRoutingModule } from './codebooks-routing.module';
import { CodebooksComponent } from './codebooks.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

//import { ToastComponent } from '@shared/toast/toast.component';
//import { ToastsContainer } from './toasts-container.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    CodebooksRoutingModule,
    DataTablesModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
  declarations: [CodebooksComponent],
})
export class CodebooksModule {}
