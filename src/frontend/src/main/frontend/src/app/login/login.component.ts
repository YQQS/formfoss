import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';

import { UserService } from '../services/user.service';
import { Router } from "@angular/router";
import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    constructor(private userService: UserService,
                private router: Router
               ) { }

    login(username: string, password: string) {
        return this.userService.login(username, password)
            .toPromise()
            .then(res => {
                return res;
            });
    }
    ngOnInit() {
    }

}
