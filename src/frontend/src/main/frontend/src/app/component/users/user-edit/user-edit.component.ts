import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
    user: User;

    constructor(private userService: UserService,
                private route: ActivatedRoute,
                private location: Location) { }

    save(): void {
        this.userService.update(this.user)
            .subscribe((user: User) => this.user = user)
    }

    goBack() : void {
        this.location.back();
    }

    ngOnInit() {
        this.route.paramMap
            .switchMap((params: ParamMap) => {
                return this.userService.getUser(+params.get('id'))
            })
            .subscribe(user => this.user = user);
    }


}
