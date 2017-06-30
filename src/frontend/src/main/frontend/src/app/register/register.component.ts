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
    private user: User;

    constructor(private userService: UserService,
                private router: Router
               ) { }

    register(username:string, password: string, email: string) {
        this.user = new User();
        this.user.userName = username;
        this.user.userPassword = password;
        this.user.userEmail = email;
        this.userService.add(this.user)
            .toPromise()
            .then(response => {
                if (response.errorMsg) {
                    alert(response.errorMsg);
                }
                this.router.navigate(['/list']);
            })
    }

    ngOnInit() {
    }

}
