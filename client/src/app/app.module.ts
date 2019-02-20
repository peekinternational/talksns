// ********** MODULES ****************************************
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HttpModule } from "@angular/http";
import { HttpClientModule} from "@angular/common/http";

// ********** SERVICES **************************************
import { CookieService } from "ngx-cookie-service";
import { ChatService } from './services/chat.service';
// ********** COMPONENT *************************************
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BackendConnector } from './services/backendconnector.service';
import { LoginStatusService } from './services/loginstatus.service';
import { AuthGuardService } from './services/authguard.service';
import { DeactivateGuardService } from './services/deactivateguard.service';
import { ReversePipe } from './shared/reverse.pipe';
import { ClearspaceDirective } from './shared/clearspace.directive';
import { TimelineComponent } from './landingpage/timeline/timeline.component';
import { LandingpageComponent } from './landingpage/landingpage.component';

const appRoutes : Routes = [
  {path: '', component: RegisterComponent},
  {path: 'signin', component: SigninComponent, canDeactivate : [DeactivateGuardService]},
  //{path: 'home', component: HomeComponent, canActivate: [AuthGuardService], canDeactivate : [DeactivateGuardService]},
  {path: 'landingpage', canActivate: [AuthGuardService] ,component: LandingpageComponent ,children: [
    {path: 'home', component: HomeComponent, canDeactivate : [DeactivateGuardService]},
    {path: 'timeline', component: TimelineComponent}
  ]},
  
  // {path : '**' , component: RegisterComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    SigninComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ReversePipe, ClearspaceDirective, TimelineComponent, LandingpageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule, HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [RouterModule, BackendConnector, LoginStatusService, AuthGuardService, DeactivateGuardService, 
              CookieService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
