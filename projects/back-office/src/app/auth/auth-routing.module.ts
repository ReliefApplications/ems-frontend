import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/*  Contain only one page, 'login'.
    All routes starting with '/auth' should redirect to 'login' page.
*/
export const routes = [
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module')
            .then(m => m.LoginModule)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
