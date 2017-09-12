import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {AlertService} from '../../../services/alert.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
    users: User[];
    selectedUser: User;

    constructor(private userService: UserService,
                private router: Router,
                private alertService: AlertService) { }

    getAll(): void {
        this.userService.getAll()
            .subscribe(users => {
                this.users = users;
            }, error => this.alertService.error(error));
    }

    onSelect(user: User): void {
        this.selectedUser = user;
    }

    deleteUser(id: number): void {
        this.userService.deleteUser(id).subscribe(
            res => {
                this.selectedUser = null;
                this.getAll();
                this.router.navigate(['/user', 'list'])
                    .then(() => this.alertService.success(res['message'] || 'Deleted'));
            },
            error => this.alertService.error(error)
        );
    }

    gotoDetail(id: number) {
        this.router.navigate(['/user', id]);
    }
    gotoEdit(id: number) {
        this.router.navigate(['/user', id, 'edit']);
    }
    ngOnInit() {
        this.getAll();
    }
}
