import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { ExportComponent } from './export.component';

const routes: Routes = [{ path: '', component: ExportComponent, data: { title: marker('Export') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ExportRoutingModule {}
