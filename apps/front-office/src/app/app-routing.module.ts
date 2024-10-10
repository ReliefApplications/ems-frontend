import { inject, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterModule,
  Routes,
} from '@angular/router';
import { ApplicationsApplicationNodesQueryResponse } from '@oort-front/shared';
import { Apollo } from 'apollo-angular';
import { lastValueFrom } from 'rxjs';
import { GET_APPLICATION_WITH_SHORTCUT } from './application/graphql/queries';
import { AccessGuard } from './guards/access.guard';
import { AuthGuard } from './guards/auth.guard';

/**
 * Resolve application id
 * Application can use shortcut values to generate the url
 * We check the given para for the application route and check if it's a shortcut
 * If it's a shortcut, return the related application id, if not return current param
 *
 * @param route ActivatedRouteSnapshot
 * @returns resolved application id
 */
const applicationIdResolver: ResolveFn<any> = async (
  route: ActivatedRouteSnapshot
): Promise<any> => {
  const id = route.paramMap.get('id');
  const apollo = inject(Apollo);
  const data = await lastValueFrom(
    apollo.query<ApplicationsApplicationNodesQueryResponse>({
      query: GET_APPLICATION_WITH_SHORTCUT,
      variables: {
        filter: {
          logic: 'and',
          filters: [
            {
              field: 'shortcut',
              operator: 'eq',
              value: id,
            },
          ],
        },
      },
    })
  );
  return data.data.applications.edges?.[0]?.node?.id ?? id;
};

/**
 * List of top level routes of the Front-Office.
 */
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./redirect/redirect.module').then((m) => m.RedirectModule),
        pathMatch: 'full',
        // canActivate: [AccessGuard],
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./application/application.module').then(
            (m) => m.ApplicationModule
          ),
        resolve: { id: applicationIdResolver },
        // canActivate: [AccessGuard],
      },
    ],
    canActivate: [AuthGuard, AccessGuard],
  },
  // {
  //   path: '**',
  //   redirectTo: '',
  //   pathMatch: 'full',
  // },
];

/**
 * Root module of Routing. Separate the front into two modules: 'auth' and 'dashboard'.
 * Use lazy loading for performance.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
