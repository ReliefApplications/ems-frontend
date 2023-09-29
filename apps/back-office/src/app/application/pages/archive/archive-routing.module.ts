import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArchiveComponent } from './archive.component';

/** Routes of archive module for application preview */
const routes: Routes = [
  {
    path: '',
    component: ArchiveComponent,
  },
];

/**
 * Archive routing module for application preview.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArchiveRoutingModule {}
