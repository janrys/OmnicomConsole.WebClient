import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { ReleaseComponent } from './release.component';

const routes: Routes = [{ path: '', component: ReleaseComponent, data: { title: marker('Release') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ReleaseRoutingModule {}
