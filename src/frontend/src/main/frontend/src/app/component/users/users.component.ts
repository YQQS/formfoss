import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    users: User[];
    selectedUser: User;

    constructor(private userService: UserService,
                private router: Router) { }

    getAll(): void {
        this.userService.getAll()
            .subscribe(users => {
                this.users = users;
            }, error => alert(error));
    }

    onSelect(user: User) : void {
        this.selectedUser = user;
    }

    deleteUser(id: number): void {
        this.userService.deleteUser(id).subscribe(
            res => {
                console.log(res.message);

                this.selectedUser = null;
                this.getAll();
                this.router.navigate(['/list']);
            },
            error => alert(error)
        );
    }

    gotoDetail() {
        this.router.navigate(['/users', this.selectedUser.userId]);
    }

    ngOnInit() {
        this.getAll();
    }
}
