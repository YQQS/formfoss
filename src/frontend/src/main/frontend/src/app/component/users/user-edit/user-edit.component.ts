import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import {AlertService} from '../../../services/alert.service';


@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
    user: User;

    constructor(private userService: UserService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private location: Location,
                private alertService: AlertService) { }

    save(): void {
        this.userService.update(this.user)
            .subscribe(
                (res: string) => {
                    this.router.navigate(['/user', this.user.userId])
                        .then(() => this.alertService.success(res['message'] || JSON.stringify(res)));
                },
                (error: string) => this.alertService.error(error));
    }

    goBack(): void {
        this.location.back();
    }

    ngOnInit() {
        this.activatedRoute.paramMap
            .switchMap((params: ParamMap) => {
                return this.userService.getUser(+params.get('id'))
            })
            .subscribe(user => this.user = user,
                error => this.alertService.error(error));
    }


}
