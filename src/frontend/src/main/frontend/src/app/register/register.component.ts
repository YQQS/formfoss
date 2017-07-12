import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    username: string;
    password: string;
    passwordRepeat: string;
    email: string;

    valid: boolean = false;
    pristine: boolean = true;

    constructor(private userService: UserService,
                private router: Router
               ) { }

    register() {
        this.userService.add(this.username, this.password, this.email)
            .toPromise()
            .then(response => {
                if (response.errorMsg) {
                    alert(response.errorMsg);
                } else {
                    alert(response.message);
                    this.router.navigate(['/list']);
                }
            })
    }

    validUserName() {

    }

    ngOnInit() {
    }

}
