import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { CodebooksComponent } from './codebooks.component';

const routes: Routes = [{ path: '', component: CodebooksComponent, data: { title: marker('Codebooks') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class CodebooksRoutingModule {}
