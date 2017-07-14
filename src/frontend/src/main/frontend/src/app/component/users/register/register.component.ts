import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {FossValidators} from "../../../validator/validator";
import {User} from "../../../models/user";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;


    constructor(private userService: UserService,
                private router: Router,
                private formBuilder: FormBuilder
               ) { }

    register() {
        console.log(this.registerForm.controls);
        return this.userService.add(this.registerForm.value.userName.trim().toLowerCase(),
            this.registerForm.value.userPassword,
            this.registerForm.value.userEmail.trim())
            .subscribe(response => {
                alert(response.message);
                this.router.navigate(['/list']);
            }, error2 => alert(error2))
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
            .map(res => res ? null: {nameConflict: true} );

    }

    emailConflict(control: AbstractControl) {
        return this.userService.emailConflict(control.value.trim())
            .map((res: boolean) => res ? null :  {emailConflict: true})
    }

}
