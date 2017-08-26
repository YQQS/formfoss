import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { User } from '../../../models/user';
import { AlertService } from '../../../services/alert.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    currentUser: User;

    constructor(
        private userService: UserService,
        private alertService: AlertService,
        private router: Router
    ) { }

    login(input: any) {
        this.userService.logout();
        return this.userService.login(input.userName.trim().toLowerCase(), input.userPassword)
            .subscribe(res => {
                this.router.navigate(['/list']);
            }, error => {
                this.alertService.error(error);
            });
    }

    ngOnInit() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    }

}
