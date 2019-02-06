
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
import { PostService } from './services/postService.service';
import { TemplatetestComponent } from './templatetest/templatetest.component';
import { ProfileeditComponent } from './profileedit/profileedit.component';
import { ReversePipe } from './shared/reverse.pipe';

const appRoutes : Routes = [
  {path: '', component: RegisterComponent},
  {path: 'signin', component: SigninComponent, canDeactivate : [DeactivateGuardService]},
  {path: 'profileedit', component: ProfileeditComponent},
  {path: 'home', component: HomeComponent , canActivate: [AuthGuardService], canDeactivate : [DeactivateGuardService]}, //, canActivate: [AuthGuardService]
  {path : '**' , component: RegisterComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    SigninComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    TemplatetestComponent,
    ProfileeditComponent,
    ReversePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule, HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [RouterModule, BackendConnector, LoginStatusService, AuthGuardService, DeactivateGuardService, 
              CookieService, PostService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
