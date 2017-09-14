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
    registerForm: FormGroup;



    constructor(private userService: UserService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private location: Location,
                private alertService: AlertService,
                private formBuilder: FormBuilder,


    ) { }


    save(): void {
        this.userService.changePassword(this.registerForm.get('userPassword').value)
            .subscribe(
                (res: string) => {
                    this.userService.logout();
                    this.router.navigate(['/login'])
                        .then(() => this.alertService.success(res['message'] || JSON.stringify(res)));
                },
                (error: string) => this.alertService.error(error));
    }

    goBack(): void {
        this.location.back();
    }


    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            userPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
            userPasswordRepeat: ['', Validators.required],
        }, {validator: FossValidators.passwordMatchValidator});
    }


}
