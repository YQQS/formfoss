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
    newUser: User;
    passwordRepeat: string;

    valid: boolean = false;
    pristine: boolean = true;

    constructor(private userService: UserService,
                private router: Router
               ) { }

    register(value: any) {
        console.log(value);
        return this.userService.add(value.userName, value.userPassword, value.userEmail)
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
