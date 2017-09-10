import { Component, OnInit } from '@angular/core';
import {AuthenticatedUser} from '../../../models/authenticatedUser';
import {ServiceUtil} from '../../../util/service.util';
import {NavigationEnd, Router} from '@angular/router';
import {UserService} from '../../../services/user.service';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
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
        this.router.navigate(['/user', this.currentUser.userId ,'self-edit']);
    }
}
