import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './component/users/login/login.component';
import {MyformComponent} from './myform/myform.component'
import { RegisterComponent } from './component/users/register/register.component';
import { UsersComponent } from './component/users/users.component';
import {UserDetailComponent} from "./component/users/user-detail/user-detail.component";
import {FormPrototypeComponent} from "./component/form-prototype/form-prototype.component";
import {DynamicFormComponent} from "./component/questions/dynamic-form/dynamic-form.component";
import {DynamicEditComponent} from "./component/questions/dynamic-edit/dynamic-edit.component";
import {QuestionListComponent} from './component/questions/question-list/question-list.component';
import {FormPreviewComponent} from './component/questions/dynamic-form/form-preview/form-preview.component';
import {FormEditComponent} from './component/questions/dynamic-edit/form-edit/form-edit.component';
import {FormNewComponent} from './component/questions/dynamic-edit/form-new/form-new.component';

const routes:Routes = [
    {path: "", redirectTo: '/questionList', pathMatch: 'full'},
    {path: 'forms', component: MyformComponent},
    {path: "prototype", component: FormPrototypeComponent},
    {path: "login", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "list", component: UsersComponent},
    {path: "users/:id", component: UserDetailComponent},
    {path: 'questionList', component: QuestionListComponent},
    {path: 'questions/edit/:id', component: FormEditComponent},
    {path: 'questions/new', component: FormNewComponent},
    {path: 'questions/:id', component: FormPreviewComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
