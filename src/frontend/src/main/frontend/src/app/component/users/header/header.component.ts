import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {AuthenticatedUser} from '../../../models/authenticatedUser';
import {NavigationEnd, Router} from '@angular/router';
import {ServiceUtil} from '../../../util/service.util';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    currentUser: AuthenticatedUser;

    constructor(private userService: UserService,
                private router: Router) { }

    ngOnInit() {
        this.currentUser = ServiceUtil.getCurrentUser();
        this.router.events.subscribe((ev) => {
            if (ev instanceof NavigationEnd) {
                this.currentUser = ServiceUtil.getCurrentUser();
            }
        });
    }

    logout() {
        this.userService.logout();
        this.router.navigate(['/home'])
    }


    edit() {
        this.router.navigate(['/profile', this.currentUser.userId]);
    }
}
