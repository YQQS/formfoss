import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { AlertService } from '../../../services/alert.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loading = false;

    // the origin url
    returnUrl: string;

    constructor(
        private userService: UserService,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    login(input: any) {

        return this.userService.login(input.userName.trim().toLowerCase(), input.userPassword)
            .subscribe(res => {
                if (res.message) {
                    this.loading = true;
                    this.router.navigateByUrl(this.returnUrl)
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

    ngOnInit() {
        this.userService.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

}
