import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
import { DeactivateGuardService } from './services/deactivateguard.service';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";

const appRoutes : Routes = [
 { path: '', component: RegisterComponent},
 { path: 'signin', component: SigninComponent, canDeactivate : [DeactivateGuardService] },
 { path: 'landingpage', loadChildren: './landingpage/timeline.module#TimelineModule' }
]

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
