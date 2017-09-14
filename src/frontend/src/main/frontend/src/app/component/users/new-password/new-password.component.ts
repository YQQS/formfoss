import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import {AlertService} from '../../../services/alert.service';
import {User} from '../../../models/user';

import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FossValidators} from '../../../validator/foss.validator';

@Component({
    selector: 'app-new-password',
    templateUrl: './new-password.component.html',
    styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
    user: User;
    registerForm: FormGroup;



    constructor(private userService: UserService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private location: Location,
                private alertService: AlertService,
                private formBuilder: FormBuilder,


    ) { }


    save(): void {
        let new_user = new User(this.user.userName,
                this.registerForm.value.userPassword,
                this.user.userEmail)
        this.user.userPassword=this.registerForm.value.userPassword;
        this.userService.update(this.user)
            .subscribe(
                (res: string) => {
                    this.router.navigate(['/home'])
                        .then(() => this.alertService.success(res['message'] || JSON.stringify(res)));
                },
                (error: string) => this.alertService.error(error));
    }

    goBack(): void {
        this.router.navigate(['/home'])
    }


    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            userName: [],
            userPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
            userPasswordRepeat: ['', Validators.required],
            userEmail: []
        }, {validator: FossValidators.passwordMatchValidator});

        this.activatedRoute.paramMap
            .switchMap((params: ParamMap) => {
                return this.userService.getUser(+params.get('id'))
            })
            .subscribe(user => this.user = user,
                error => this.alertService.error(error));
    }


}
