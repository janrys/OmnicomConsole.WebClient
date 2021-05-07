import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { CodebooksRoutingModule } from './codebooks-routing.module';
import { CodebooksComponent } from './codebooks.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';

//import { ToastComponent } from '@shared/toast/toast.component';
//import { ToastsContainer } from './toasts-container.component';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, CodebooksRoutingModule, DataTablesModule, FormsModule],
  declarations: [CodebooksComponent],
})
export class CodebooksModule {}
