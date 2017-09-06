import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {ServiceUtil} from '../../util/service.util';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private alertService: AlertService,
                private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (ServiceUtil.isAdmin()) {
            return true;
        }

        this.router.navigate(['/can-not-access']);
        return false;
    }
}
