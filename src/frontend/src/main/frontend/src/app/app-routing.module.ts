import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './component/users/login/login.component';
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
import {FRQuestionComponent} from "./component/questions/form-result/frquestion/frquestion.component";
import {FRStatComponent} from "./component/questions/form-result/frstat/frstat.component";
import {FRUserComponent} from "./component/questions/form-result/fruser/fruser.component";
import {HomePageComponent} from "./component/questions/homepage/homepage.component";
import {UserEditComponent} from "./component/users/user-edit/user-edit.component";

const routes:Routes = [
    {path: "", redirectTo: '/homepage', pathMatch: 'full'},
    {path: "homepage" ,component:HomePageComponent},
    {path: "prototype", component: FormPrototypeComponent},
    {path: "login", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "list", component: UsersComponent},
    {path: "editusers/:id", component: UserEditComponent},
    {path: "users/:id", component: UserDetailComponent},
    {path: 'questionList', component: QuestionListComponent},
    {path: 'questions/edit/:id', component: FormEditComponent},
    {path: 'questions/new', component: FormNewComponent},
    {path: 'questions/:id', component: FormPreviewComponent},
    {path: 'formStat/:id', component: FRStatComponent},
    {path: 'formUserStat/:id', component: FRUserComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
