import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import {QuestionService} from "../../services/question.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    constructor(
                private userService: UserService,
                private router: Router
               ) { }

    login(input: any) {
        return this.userService.login(input.userName, input.userPassword)
            .subscribe(res => {
                alert(res['message']);
                this.router.navigate(['/list']);
            });
    }
    ngOnInit() {
    }

}
