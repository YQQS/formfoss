import {Component, OnInit} from '@angular/core';
import {UserService} from './services/user.service';
import {Router} from '@angular/router';
import {AuthenticatedUser} from './models/authenticatedUser';
import {ServiceUtil} from './util/service.util';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'formfoss';
    currentUser: AuthenticatedUser;

    constructor(private userService: UserService,
                private router: Router) {}

    ngOnInit() {
        this.currentUser = ServiceUtil.getCurrentUser();
    }



}
