import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { ImportComponent } from './import.component';

const routes: Routes = [{ path: '', component: ImportComponent, data: { title: marker('Import') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ImportRoutingModule {}
