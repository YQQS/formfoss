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
                private route: ActivatedRoute,
                private location: Location,
                private alertService: AlertService) { }

    save(): void {
        this.userService.update(this.user)
            .subscribe(
                (res: any) => {
                    this.alertService.success(res['message'] || JSON.stringify(res));
                }, error => {
                    this.alertService.error(error);
                }
            )
    }

    goBack(): void {
        this.location.back();
    }

    ngOnInit() {
        this.route.paramMap
            .switchMap((params: ParamMap) => {
                return this.userService.getUser(+params.get('id'))
            })
            .subscribe(user => this.user = user,
                error => this.alertService.error(error));
    }


}
