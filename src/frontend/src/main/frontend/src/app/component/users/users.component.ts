import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    users: User[];
    filteredUsers: Observable<User[]>;
    private searchTerm = new Subject<string>();

    constructor(private userService: UserService,
                private router: Router) { }

    search(str: string) {
        this.searchTerm.next(str);
    }

    searchUser(): void {
        this.filteredUsers = this.searchTerm
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap(term => {
                 if (!term || term === '') {
                     return this.userService.getAll();
                 } else {
                     return this.userService.getAll(term.trim(), "", true);
                 }
            })
            .catch(error => {
                console.error(error);
                return Observable.of<User[]>([]);
            })
    }

    getAll() {
        this.userService.getAll()
            .subscribe(users => this.users = users)
    }

    deleteUser(id: number): void {
        this.userService.deleteUser(id).subscribe(
            res => {
                console.log(res);
                this.getAll();
            },
            error => alert(error)
        );
    }

    gotoDetail(id: number) {
        this.router.navigate(['/users', id]);
    }

    ngOnInit() {
        this.getAll();
        this.searchUser();
    }
}
