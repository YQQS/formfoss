import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import {AlertService} from '../../../services/alert.service';



@Component({
    selector: 'app-user-self-edit',
    templateUrl: './user-self-edit.component.html',
    styleUrls: ['./user-self-edit.component.scss']
})
export class UserSelfEditComponent implements OnInit {
    user: User;
<<<<<<< HEAD
=======
    users: User[];
>>>>>>> 746f9e794d1fc28fb81ae58ab6dd3c5c25299f87

    constructor(private userService: UserService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private location: Location,
                private alertService: AlertService,

    ) { }


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
<<<<<<< HEAD
        this.router.navigate(['/home'])
=======
        this.location.back();
>>>>>>> 746f9e794d1fc28fb81ae58ab6dd3c5c25299f87
    }

    deleteUser(id: number): void {

        this.userService.deleteUser(id).subscribe(
            res => {
                this.user = null;
                this.router.navigate(['/login'])
                    .then(() => this.alertService.success(res['message'] || 'Deleted'));
                this.userService.logout();
            },

            error => this.alertService.error(error)
        );
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
