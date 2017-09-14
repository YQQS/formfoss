import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import 'rxjs/add/operator/toPromise';
import { User } from '../../../models/user';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {AlertService} from '../../../services/alert.service';

@Component({
    selector: 'app-user-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    user: User;
    users: User[];

    loading = false;

    // the origin url
    returnUrl: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute

    ) { }

    login(input: any) {

        return this.userService.verify(this.user.userName, input.userPassword)
            .subscribe(res => {
                if (res.message) {
                    this.loading = true;
                    this.router.navigate(['/user', this.user.userId, 'new-password'],)
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
        this.router.navigate(['/home'])
    }

    ngOnInit() {
        this.activatedRoute.paramMap
            .switchMap((params: ParamMap) => {
                return this.userService.getUser(+params.get('id'))
            })
            .subscribe(user => this.user = user,
                error => this.alertService.error(error));

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

}


