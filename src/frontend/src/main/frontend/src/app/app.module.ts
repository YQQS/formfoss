import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {UserService} from './services/user.service';
import {LoginComponent} from './component/users/login/login.component';
import {RegisterComponent} from './component/users/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppRoutingModule} from './app-routing.module';
import {UserListComponent} from './component/users/user-list/user-list.component';
import { UserDetailComponent } from './component/users/user-detail/user-detail.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MdAutocompleteModule, MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdChipsModule,
    MdDatepickerModule,
    MdDialogModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdNativeDateModule, MdProgressBarModule, MdProgressSpinnerModule, MdRadioModule, MdSelectModule, MdSidenavModule,
    MdSliderModule,
    MdSlideToggleModule, MdSnackBarModule,
    MdTabsModule,
    MdToolbarModule, MdTooltipModule
} from '@angular/material';
import 'hammerjs';
import { FormViewComponent } from './component/form/view/form-view/form-view.component';
import { QuestionViewComponent } from './component/form/view/question-view/question-view.component';
import { FormStructureEditComponent } from './component/form/edit/form-structure-edit/form-structure-edit.component';
import {QuestionService} from './services/question.service';
import { HomeComponent} from './component/extra/home/home.component';
import { FormListComponent } from './component/form/list/form-list.component';
import { FormDetailComponent } from './component/form/view/form-detail/form-detail.component';
import { FormEditComponent } from './component/form/edit/form-edit/form-edit.component';
import { FormNewComponent } from './component/form/edit/form-new/form-new.component';
import { FormSettingsComponent } from './component/form/edit/form-settings/form-settings.component';
import { QuestionStatComponent } from './component/form/stat/question-stat/question-stat.component';
import { UserStatComponent } from './component/form/stat/user-stat/user-stat.component';
import { FormStatComponent } from './component/form/stat/form-stat/form-stat.component';
import {ChartsModule} from 'ng2-charts';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {SubmitPreviewComponent} from './component/form/view/form-submit-preview/submit-preview.component';
import {UserEditComponent} from './component/users/user-edit/user-edit.component';
import { AlertDialogComponent } from './component/_directives/alert-dialog/alert-dialog.component';
import {AlertService} from './services/alert.service';
import {AlertComponent} from './component/_directives/alert/alert.component';
import {AuthGuard} from './component/_guards/auth.guard';
import { PageNotFoundComponent } from './component/extra/page-not-found/page-not-found.component';
import { CanNotAccessComponent } from './component/extra/can-not-access/can-not-access.component';
import {AdminGuard} from './component/_guards/admin.guard';
import { AdminComponent } from './component/_navigation/admin/admin.component';
import { ToolbarComponent } from './component/_navigation/toolbar/toolbar.component';
import {UserSelfEditComponent}from'./component/users/user-self-edit/user-self-edit.component';
import { AnswerViewComponent } from './component/form/answer/answer-view/answer-view.component';
import { QuestionAnsweredViewComponent } from './component/form/answer/question-answered-view/question-answered-view.component';
import { AnswerListComponent } from './component/form/answer/answer-list/answer-list.component';
import { AnswerDetailComponent } from './component/form/answer/answer-detail/answer-detail.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        UserListComponent,
        UserDetailComponent,
        FormViewComponent,
        QuestionViewComponent,
        FormStructureEditComponent,
        FormListComponent,
        FormListComponent,
        FormDetailComponent,
        FormEditComponent,
        FormNewComponent,
        FormSettingsComponent,
        QuestionStatComponent,
        UserStatComponent,
        FormStatComponent,
        HomeComponent,
        SubmitPreviewComponent,
        AlertDialogComponent,
        UserEditComponent,
        AlertComponent,
        PageNotFoundComponent,
        CanNotAccessComponent,
        AdminComponent,
        ToolbarComponent,
        UserSelfEditComponent,
        AnswerViewComponent,
        QuestionAnsweredViewComponent,
        AnswerListComponent,
        AnswerDetailComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        MdButtonModule,
        MdButtonToggleModule,
        MdCheckboxModule,
        MdInputModule,
        MdNativeDateModule,
        ReactiveFormsModule,
        MdAutocompleteModule,
        MdRadioModule,
        MdDatepickerModule,
        MdSelectModule,
        MdSliderModule,
        MdSlideToggleModule,
        MdMenuModule,
        MdSidenavModule,
        MdToolbarModule,
        MdListModule,
        MdGridListModule,
        MdCardModule,
        MdTabsModule,
        MdDialogModule,
        MdIconModule,
        MdChipsModule,
        MdProgressBarModule,
        MdProgressSpinnerModule,
        MdDialogModule,
        MdTooltipModule,
        MdSnackBarModule,
        ChartsModule,
        MdTooltipModule
    ],
    entryComponents: [SubmitPreviewComponent, AlertDialogComponent],
    providers: [UserService, QuestionService, AlertService, AuthGuard, AdminGuard, {
        provide: LocationStrategy, useClass: HashLocationStrategy}, {
        provide: APP_BASE_HREF, useValue: '/'
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
