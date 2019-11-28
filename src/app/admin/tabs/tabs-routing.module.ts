import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'calendar',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../calendar/calendar.module').then(m => m.CalendarModule)
          }
        ]
      },
      {
        path: 'schedule',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../schedule/schedule.module').then(m => m.ScheduleModule)
          }
        ]
      },
      {
        path: 'customers',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../customers/customers.module').then(m => m.CustomersModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/admin/tabs/calendar',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/calendar',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
