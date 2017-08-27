import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './component/users/login/login.component';
import { RegisterComponent } from './component/users/register/register.component';
import { UsersComponent } from './component/users/users.component';
import {UserDetailComponent} from './component/users/user-detail/user-detail.component';
import {FormPrototypeComponent} from './component/form-prototype/form-prototype.component';
import {QuestionListComponent} from './component/questions/question-list/question-list.component';
import {FormPreviewComponent} from './component/questions/dynamic-form/form-preview/form-preview.component';
import {FormEditComponent} from './component/questions/dynamic-edit/form-edit/form-edit.component';
import {FormNewComponent} from './component/questions/dynamic-edit/form-new/form-new.component';
import {FRStatComponent} from './component/questions/form-result/frstat/frstat.component';
import {FRUserComponent} from './component/questions/form-result/fruser/fruser.component';
import {HomePageComponent} from './component/questions/homepage/homepage.component';
import { MyUserEditComponent} from './component/users/myuser-edit/myuser-edit.component';
import {AuthGuard} from './component/_guards/auth.guard';

const routes: Routes = [
    {path: '', redirectTo: '/homepage', pathMatch: 'full'},
    {path: 'homepage', component: HomePageComponent},
    {path: 'prototype', component: FormPrototypeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'list', component: UsersComponent, canActivate: [AuthGuard]},
    {path: 'users/:id', component: UserDetailComponent, canActivate: [AuthGuard]},
    {path: 'editUsers/:id', component: MyUserEditComponent, canActivate: [AuthGuard]},
    {path: 'questionList', component: QuestionListComponent, canActivate: [AuthGuard]},
    {path: 'questions/edit/:id', component: FormEditComponent, canActivate: [AuthGuard]},
    {path: 'questions/new', component: FormNewComponent},
    {path: 'questions/:id', component: FormPreviewComponent},
    {path: 'formStat/:id', component: FRStatComponent, canActivate: [AuthGuard]},
    {path: 'formUserStat/:id', component: FRUserComponent, canActivate: [AuthGuard]},
    {path: 'profile/:id', component: MyUserEditComponent, canActivate: [AuthGuard]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
