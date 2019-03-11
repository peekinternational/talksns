import { CanActivate, Router, CanActivateChild } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { LoginStatusService } from "./loginstatus.service";

// *** This Guard is used to check whether a user can be routed or not ****

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

    constructor(private loginService: LoginStatusService, private router: Router) { }

    canActivate(): boolean {
        if (this.loginService.isUserLoggedIn()) {// if user is logged in
            return true;
        }
        
        // navigate and abort further normal operations by returning false
        this.router.navigate(['/']);
        return false;
    }

    canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate();
    }
}
