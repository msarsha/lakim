import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';
import {AngularFireAuthGuard} from '@angular/fire/auth-guard';
import {HomeComponent} from '../home/home.component';
import {SwapsComponent} from '../swaps/swaps.component';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [AngularFireAuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'swaps',
        component: SwapsComponent
      },
      {
        path: '',
        redirectTo: '/client/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
