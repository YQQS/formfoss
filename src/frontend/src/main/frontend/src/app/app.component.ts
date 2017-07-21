import {Component, OnInit} from '@angular/core';
import {User} from "./models/user";
import {UserService} from "./services/user.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'formfoss';
    currentUser: User;

    constructor(private userService: UserService,
                private router: Router) {}

    ngOnInit() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    }

    getUser() {
        return sessionStorage.getItem('currentUser');
    }

    logout() {
        sessionStorage.removeItem('currentUser');
        this.userService.logout().subscribe(
            res => {
                alert(res.message)
                this.router.navigate(['/homepage']);
            }
        )
    }


    edit() {}

}
