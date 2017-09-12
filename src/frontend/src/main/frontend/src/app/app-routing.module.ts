import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './component/users/login/login.component';
import { RegisterComponent } from './component/users/register/register.component';
import { UserListComponent } from './component/users/user-list/user-list.component';
import {UserDetailComponent} from './component/users/user-detail/user-detail.component';
import {FormListComponent} from './component/form/list/form-list.component';
import {FormDetailComponent} from './component/form/view/form-detail/form-detail.component';
import {FormEditComponent} from './component/form/edit/form-edit/form-edit.component';
import {FormNewComponent} from './component/form/edit/form-new/form-new.component';
import {FormStatComponent} from './component/form/stat/form-stat/form-stat.component';
import {UserStatComponent} from './component/form/stat/user-stat/user-stat.component';
import {HomeComponent} from './component/extra/home/home.component';
import {AuthGuard} from './component/_guards/auth.guard';
import {PageNotFoundComponent} from './component/extra/page-not-found/page-not-found.component';
import {CanNotAccessComponent} from './component/extra/can-not-access/can-not-access.component';
import {AdminGuard} from './component/_guards/admin.guard';
import {UserEditComponent} from './component/users/user-edit/user-edit.component';
import {UserSelfEditComponent} from './component/users/user-self-edit/user-self-edit.component';
import { AlertDialogComponent } from './component/_directives/alert-dialog/alert-dialog.component';
import {AnswerListComponent} from './component/form/answer/answer-list/answer-list.component';
import {AnswerViewComponent} from './component/form/answer/answer-view/answer-view.component';
import {AnswerDetailComponent} from './component/form/answer/answer-detail/answer-detail.component';

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'dialog', component: AlertDialogComponent},


    {path: 'user', canActivate: [AuthGuard], children: [
        {path: 'list', component: UserListComponent, canActivate: [AdminGuard]},
        {path: ':id', children: [
            {path: '', component: UserDetailComponent},
            {path: 'edit', component: UserEditComponent},
            {path: 'self-edit', component: UserSelfEditComponent},
        ]},
    ]},
    {path: 'question', children: [
        {path: 'new', component: FormNewComponent, canActivate: [AuthGuard]},
        {path: 'list', component: FormListComponent, canActivate: [AuthGuard]},
        {path: ':id', children: [
            {path: '', redirectTo: 'view', pathMatch: 'prefix'},
            {path: 'view', component: FormDetailComponent},
            {path: 'edit', component: FormEditComponent, canActivate: [AuthGuard]},
            {path: 'stat', canActivate: [AuthGuard], children: [
                {path: '', component: FormStatComponent},
                {path: 'user', component: UserStatComponent}
            ]}
        ]}
    ]},
    {path: 'answer', canActivate: [AuthGuard], children: [
        {path: '', redirectTo: 'list', pathMatch: 'prefix'},
        {path: 'list', component: AnswerListComponent},
        {path: ':id', children: [
            {path: '', redirectTo: 'detail', pathMatch: 'prefix'},
            {path: 'detail', component: AnswerDetailComponent}
        ]}
    ]},
    {path: 'can-not-access', component: CanNotAccessComponent},
    {path: '**', component: PageNotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
