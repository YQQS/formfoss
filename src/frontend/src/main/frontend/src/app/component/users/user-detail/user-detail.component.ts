import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import {AlertService} from '../../../services/alert.service';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
    user: User;

    constructor(private userService: UserService,
                private activatedRoute: ActivatedRoute,
                private location: Location,
                private alertService: AlertService) { }

    goBack(): void {
        this.location.back();
    }

    ngOnInit() {
        const id = +this.activatedRoute.snapshot.params['id'];
        this.userService.getUser(id)
            .subscribe(user => this.user = user,
                error => this.alertService.error(error));
    }


}
