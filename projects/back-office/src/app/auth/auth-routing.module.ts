import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AccessGuard } from '../guards/access.guard';

/*  Contain only one page, 'login'.
    All routes starting with '/auth' should redirect to 'login' page.
*/
export const routes = [
    {
        path: 'login',
        canActivate: [MsalGuard, AccessGuard],
    },
    {
        path: '',
        children: [
            {
                path: '',
                loadChildren: () => import('./pages/login/login.module')
                .then(m => m.LoginModule),
            },
            {
                path: 'login',
                canActivate: [MsalGuard, AccessGuard],
            },
            ]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
