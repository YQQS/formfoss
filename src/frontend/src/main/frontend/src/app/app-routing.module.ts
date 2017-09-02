import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './component/users/login/login.component';
import { RegisterComponent } from './component/users/register/register.component';
import { UserListComponent } from './component/users/user-list/user-list.component';
import {UserDetailComponent} from './component/users/user-detail/user-detail.component';
import {FormPrototypeComponent} from './component/form-prototype/form-prototype.component';
import {FormListComponent} from './component/form/list/form-list.component';
import {FormPreviewComponent} from './component/form/view/form-preview/form-preview.component';
import {FormEditComponent} from './component/form/edit/form-edit/form-edit.component';
import {FormNewComponent} from './component/form/edit/form-new/form-new.component';
import {FormStatComponent} from './component/form/stat/form-stat/form-stat.component';
import {UserStatComponent} from './component/form/stat/user-stat/user-stat.component';
import {HomeComponent} from './component/extra/home/home.component';
import { MyUserEditComponent} from './component/users/myuser-edit/myuser-edit.component';
import {AuthGuard} from './component/_guards/auth.guard';
import {PageNotFoundComponent} from './component/extra/page-not-found/page-not-found.component';
import {CanNotAccessComponent} from './component/extra/can-not-access/can-not-access.component';
import {AdminGuard} from './component/_guards/admin.guard';

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'prototype', component: FormPrototypeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'userList', component: UserListComponent, canActivate: [AuthGuard, AdminGuard]},
    {path: 'users/:id', component: UserDetailComponent, canActivate: [AuthGuard]},
    {path: 'editUsers/:id', component: MyUserEditComponent, canActivate: [AuthGuard]},
    {path: 'questionList', component: FormListComponent, canActivate: [AuthGuard, AdminGuard]},
    {path: 'questions/edit/:id', component: FormEditComponent, canActivate: [AuthGuard]},
    {path: 'questions/new', component: FormNewComponent},
    {path: 'questions/:id', component: FormPreviewComponent},
    {path: 'formStat/:id', component: FormStatComponent, canActivate: [AuthGuard]},
    {path: 'formUserStat/:id', component: UserStatComponent, canActivate: [AuthGuard]},
    {path: 'profile/:id', component: MyUserEditComponent, canActivate: [AuthGuard]},
    {path: 'can-not-access', component: CanNotAccessComponent},
    {path: '**', component: PageNotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
