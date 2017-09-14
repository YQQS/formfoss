import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import 'rxjs/add/operator/toPromise';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {AlertService} from '../../../services/alert.service';
import {Location} from '@angular/common';
import {ServiceUtil} from '../../../util/service.util';

@Component({
    selector: 'app-user-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private alertService: AlertService,
        private router: Router,
        private location: Location,
        private route: ActivatedRoute

    ) { }

    login(input: any) {
        return this.userService.verify(ServiceUtil.getCurrentUser().username, input.password)
            .subscribe(res => {
                if (res.message) {
                    this.router.navigate(['/user', ServiceUtil.getCurrentUser().userId, 'new-password'])
                        .then(() =>
                            this.alertService.success(res.message));
                } else if (res.errorMsg) {
                    this.alertService.error(res.errorMsg);
                } else {
                    this.alertService.error(JSON.stringify(res));
                }
            }, (error: string) => {
                this.alertService.error(error);
            });
    }

    goBack(): void {
        this.location.back();
    }

    ngOnInit() {
    }

}


