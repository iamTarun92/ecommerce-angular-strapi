import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order.component';

const routes: Routes = [
  {
    path: '', component: OrderComponent,
    children: [
      { path: '', loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule) },
      {
        path: 'order_details',
        loadChildren: () => import('./order-list/order-list.module').then(m => m.OrderListModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
