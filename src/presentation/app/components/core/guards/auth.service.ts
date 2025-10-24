import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../../../domain/services/authentication.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService implements CanActivate {

	constructor(
		private authenticationService: AuthenticationService,
		private route: Router

	) {

	}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		if (this.authenticationService.isLoggedIn()) {
			return true;
		} else {
			this.route.navigate(["login"]);
			return false;
		}
	}

}
