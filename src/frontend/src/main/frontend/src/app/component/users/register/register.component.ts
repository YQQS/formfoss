import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {FossValidators} from '../../../validator/foss.validator';
import {User} from '../../../models/user';
import {AlertService} from '../../../services/alert.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;

    constructor(private userService: UserService,
                private alertService: AlertService,
                private router: Router,
                private formBuilder: FormBuilder
               ) { }

    register() {
        return this.userService.signup(
            this.registerForm.value.userName.trim().toLowerCase(),
            this.registerForm.value.userPassword,
            this.registerForm.value.userEmail.trim())
            .subscribe(response => {
                if (response.message) {
                    this.loading = true;
                    this.alertService.success(response.message);
                    this.router.navigate(['/login']);
                } else if (response.errorMsg) {
                    this.alertService.error(response.errorMsg);
                } else {
                    this.alertService.error(JSON.stringify(response));
                }
            }, error2 => this.alertService.error(error2))
    }


    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)], this.nameConflict.bind(this) ],
            userPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
            userPasswordRepeat: ['', Validators.required],
            userEmail: ['', [Validators.required, Validators.email], this.emailConflict.bind(this)]
        }, {validator: FossValidators.passwordMatchValidator});
    }

    nameConflict(control: AbstractControl) {
        return this.userService.nameConflict(control.value.trim().toLowerCase())
            .map(res => res ? null : {nameConflict: true} );

    }

    emailConflict(control: AbstractControl) {
        return this.userService.emailConflict(control.value.trim())
            .map((res: boolean) => res ? null :  {emailConflict: true})
    }

}
