import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AlertService} from '../../services/alert.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router,
                private alertService: AlertService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (sessionStorage.getItem('currentUser')) {
            return true;
        }

        this.router.navigate(['/login'], {
            queryParams: {
                returnUrl: state.url
            }
        }).then(() => {
            this.alertService.error('Please log in first to continue your operation');
        });
        return false;
    }
}
