import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'roles',
        loadChildren: () => import('./../roles/roles.module')
          .then(m => m.RolesModule),
        // canActivate: [SafePermissionGuard]
      },
      {
        path: 'users',
        loadChildren: () => import('./../users/users.module')
          .then(m => m.UsersModule),
        // canActivate: [SafePermissionGuard]
      },
      {
        path: 'position',
        children: [
          {
            path: '',
            loadChildren: () => import('./../position/position.module')
            .then(m => m.PositionModule),
            // canActivate: [SafePermissionGuard]
          },
          {
            path: ':id',
            loadChildren: () => import('./../position-attributes/position-attributes.module')
              .then(m => m.PositionAttributesModule),
            // canActivate: [SafePermissionGuard]
          },
        ]
      },
      {
        path: 'channels',
        loadChildren: () => import('./../channels/channels.module')
          .then(m => m.ChannelsModule),
        // canActivate: [SafePermissionGuard]
      },
      {
        path: 'subscriptions',
        loadChildren: () => import('./../subscriptions/subscriptions.module')
          .then(m => m.SubscriptionsModule),
        // canActivate: [SafePermissionGuard]
      },
      {
        path: 'pull-jobs',
        loadChildren: () => import('./../pull-jobs/pull-jobs.module')
          .then(m => m.PullJobsModule),
        // canActivate: [SafePermissionGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
