import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { InfoComponent } from './info.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    //{ path: '', redirectTo: '/info', pathMatch: 'full' },
    { path: '', component: InfoComponent, data: { title: marker('Info') } },
    { path: 'info', component: InfoComponent, data: { title: marker('Info') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class InfoRoutingModule {}
