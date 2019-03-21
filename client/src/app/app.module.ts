// ********** MODULES ****************************************
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HttpModule } from "@angular/http";
import { HttpClientModule} from "@angular/common/http";

// ********** SERVICES **************************************
import { SocketService } from './services/socket.service';
import { AngularWebStorageModule } from 'angular-web-storage';
// ********** COMPONENT *************************************
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BackendConnector } from './services/backendconnector.service';
import { LoginStatusService } from './services/loginstatus.service';
import { AuthGuardService } from './services/authguard.service';
import { DeactivateGuardService } from './services/deactivateguard.service';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularWebStorageModule,
    HttpModule, HttpClientModule,
    AppRoutingModule
  ],
  providers: [BackendConnector, LoginStatusService, AuthGuardService, DeactivateGuardService, SocketService],
  bootstrap: [AppComponent],

  exports: []
})
export class AppModule { }
