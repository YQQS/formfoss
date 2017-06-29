import { Component, OnInit } from '@angular/core';
import {User} from "../models/user";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-useres',
    templateUrl: './useres.component.html',
    styleUrls: ['./useres.component.css']
})
export class UseresComponent implements OnInit {
    users: User[];
    selectedUser: User;

    constructor(private userService: UserService,
                private router: Router) { }

    getAll(): void {
        this.userService.getAll()
            .then(users => {
                this.users = users;
            });
    }

    onSelect(user: User) : void {
        this.selectedUser = user;
    }

    ngOnInit() {
        this.getAll();
    }
}
