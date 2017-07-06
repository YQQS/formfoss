import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {FossValidators} from "../validator/validator";

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
        return this.userService.add(this.registerForm.value.userName,
            this.registerForm.value.userPassword,
            this.registerForm.value.userEmail)
            .then(response => {
                if (response.errorMsg) {
                    alert(response.errorMsg);
                } else {
                    alert(response.message);
                    this.router.navigate(['/list']);
                }
            })
    }


    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
            userPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
            userPasswordRepeat: ['', Validators.required],
            userEmail: ['', [Validators.required, Validators.email]]
        }, {validator: FossValidators.passwordMatchValidator});
    }

}
