import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import {UserService} from "../../services/user.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
    user: User;

    constructor(private userService: UserService,
                private route: ActivatedRoute,
                private location: Location) { }

    save(): void {
        this.userService.update(this.user)
            .then(() => this.goBack());
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
