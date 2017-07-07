import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';
import {UserDetailComponent} from "./users/user-detail/user-detail.component";
import {FormExampleComponent} from './component/form-example/form-example.component';
import {FormPrototypeComponent} from "./component/form-prototype/form-prototype.component";
<<<<<<< HEAD
import {QuestionnaireComponent} from "./myquestionnaire;/questionnaire.component";

const routes:Routes = [
    {path: "", redirectTo: '/prototype', pathMatch: 'full'},
    {path: "questionnaire", component: QuestionnaireComponent},
=======
import {DynamicFormComponent} from "./questions/dynamic-form/dynamic-form.component";

const routes:Routes = [
    {path: "", redirectTo: '/dynamic-form', pathMatch: 'full'},
>>>>>>> 84ca2ef3af5ac24f78ba86512f877f236003d126
    {path: "prototype", component: FormPrototypeComponent},
    {path: "login", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "list", component: UsersComponent},
    {path: "users/:id", component: UserDetailComponent},
    {path: 'form', component: FormExampleComponent},
    {path: 'dynamic-form', component: DynamicFormComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
