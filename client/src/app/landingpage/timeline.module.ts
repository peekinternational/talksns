import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";

import { AuthGuardService } from '../services/authguard.service';
import { DeactivateGuardService } from '../services/deactivateguard.service';

import { ReversePipe } from '../shared/reverse.pipe';
import { ClearspaceDirective } from '../shared/clearspace.directive';
import { DropdownDirective } from '../shared/dropdown.directive';

import { HomeComponent } from './home/home.component';
import { LandingpageComponent } from '../landingpage/landingpage.component';
import { TimelineComponent } from '../landingpage/timeline/timeline.component';

const appRoutes : Routes = [
  {path: '', canActivate: [AuthGuardService] ,component: LandingpageComponent ,children: [
    {path: 'home', component: HomeComponent, canDeactivate : [DeactivateGuardService]},
    {path: 'timeline', component: TimelineComponent}
  ]},
]


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [ HomeComponent, LandingpageComponent, TimelineComponent,
                  ReversePipe, ClearspaceDirective, DropdownDirective,],
  exports: [RouterModule]
})
export class TimelineModule { }
