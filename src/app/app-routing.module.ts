import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'codebooks', loadChildren: () => import('./codebooks/codebooks.module').then((m) => m.CodebooksModule) },
    { path: 'release', loadChildren: () => import('./release/release.module').then((m) => m.ReleaseModule) },
    { path: 'import', loadChildren: () => import('./import/import.module').then((m) => m.ImportModule) },
    { path: 'export', loadChildren: () => import('./export/export.module').then((m) => m.ExportModule) },
    { path: 'master', loadChildren: () => import('./master/master.module').then((m) => m.MasterModule) },
    { path: 'detail', loadChildren: () => import('./detail/detail.module').then((m) => m.DetailModule) },
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
