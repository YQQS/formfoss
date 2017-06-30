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
    constructor(private userService: UserService,
                private router: Router
               ) { }

    register(username:string, password: string, email: string) {
        this.userService.add(username, password, email)
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

    ngOnInit() {
    }

}
