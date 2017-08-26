import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { AlertService } from '../../../services/alert.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(
        private userService: UserService,
        private alertService: AlertService,
        private router: Router
    ) { }

    login(input: any) {
        this.userService.logout();
        return this.userService.login(input.userName.trim().toLowerCase(), input.userPassword)
            .subscribe(res => {
                if (res.message) {
                    this.alertService.success(res.message);
                    this.router.navigate(['/list']);
                } else if (res.errorMsg) {
                    this.alertService.error(res.errorMsg);
                } else {
                    this.alertService.error(JSON.stringify(res));
                }
            }, (error: Response) => {
                if (error.status === 401) {
                    this.alertService.error('username or password not match');
                } else {
                    this.alertService.error('failed, unexpected response returned from server');
                }
            });
    }

    ngOnInit() {
    }

}
