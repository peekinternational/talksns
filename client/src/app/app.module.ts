// ********** MODULES ****************************************
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HttpModule } from "@angular/http";
import { HttpClientModule} from "@angular/common/http";

// ********** SERVICES **************************************
import { ChatService } from './services/chat.service';
import { AngularWebStorageModule } from 'angular-web-storage';
// ********** COMPONENT *************************************
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
//import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BackendConnector } from './services/backendconnector.service';
import { LoginStatusService } from './services/loginstatus.service';
import { AuthGuardService } from './services/authguard.service';
import { DeactivateGuardService } from './services/deactivateguard.service';
//import { ReversePipe } from './shared/reverse.pipe';
//import { ClearspaceDirective } from './shared/clearspace.directive';
//import { TimelineComponent } from './landingpage/timeline/timeline.component';
//import { LandingpageComponent } from './landingpage/landingpage.component';
//import { DropdownDirective } from './shared/dropdown.directive';
import { AppRoutingModule } from './app-routing.module';


//const appRoutes : Routes = []

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    SigninComponent,
    //HomeComponent,
    HeaderComponent,
    FooterComponent
 //   ReversePipe, ClearspaceDirective, DropdownDirective,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularWebStorageModule,
    HttpModule, HttpClientModule,
    AppRoutingModule
   // RouterModule.forRoot(appRoutes)
  ],
  providers: [BackendConnector, LoginStatusService, AuthGuardService, DeactivateGuardService, ChatService],
  bootstrap: [AppComponent],

  exports: []
})
export class AppModule { }
