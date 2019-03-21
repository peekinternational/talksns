import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';

const appRoutes : Routes = [
 { path: '', component: RegisterComponent},
 { path: 'landingpage', loadChildren: './landingpage/timeline.module#TimelineModule' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
