import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import {User} from '../../../models/user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    currentUser: User;

    constructor(
                private userService: UserService,
                private router: Router
               ) { }

    login(input: any) {
        return this.userService.login(input.userName.trim().toLowerCase(),
                input.userPassword)
            .subscribe(res => {
                alert(res['message']);
                this.userService.getAll(input.userName)
                    .subscribe(user => {
                        this.currentUser = user[0];
                        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    });
                this.router.navigate(['/list']);
            }, error => alert(error));
    }

    ngOnInit() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    }

}
