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
import { FormPrototypeComponent } from './component/form-prototype/form-prototype.component';
import { FormViewComponent } from './component/form/view/form-view/form-view.component';
import { QuestionViewComponent } from './component/form/view/question-view/question-view.component';
import { FormStructureEditComponent } from './component/form/edit/form-structure-edit/form-structure-edit.component';
import {QuestionService} from './services/question.service';
import { HomeComponent} from './component/extra/home/home.component';
import { FormListComponent } from './component/form/list/form-list.component';
import { FormPreviewComponent } from './component/form/view/form-preview/form-preview.component';
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
import {MyUserEditComponent} from './component/users/myuser-edit/myuser-edit.component';
import {AlertService} from './services/alert.service';
import {AlertComponent} from './component/_directives/alert/alert.component';
import {AuthGuard} from './component/_guards/auth.guard';
import { PageNotFoundComponent } from './component/extra/page-not-found/page-not-found.component';
import { CanNotAccessComponent } from './component/extra/can-not-access/can-not-access.component';
import {AdminGuard} from './component/_guards/admin.guard';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        UserListComponent,
        UserDetailComponent,
        FormPrototypeComponent,
        FormViewComponent,
        QuestionViewComponent,
        FormStructureEditComponent,
        FormListComponent,
        FormListComponent,
        FormPreviewComponent,
        FormEditComponent,
        FormNewComponent,
        FormSettingsComponent,
        QuestionStatComponent,
        UserStatComponent,
        FormStatComponent,
        HomeComponent,
        SubmitPreviewComponent,
        AlertDialogComponent,
        MyUserEditComponent,
        UserEditComponent,
        AlertComponent,
        PageNotFoundComponent,
        CanNotAccessComponent
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
        ChartsModule
    ],
    entryComponents: [SubmitPreviewComponent, AlertDialogComponent],
    providers: [UserService, QuestionService, AlertService, AuthGuard, AdminGuard, {
        provide: LocationStrategy, useClass: HashLocationStrategy}, {
        provide: APP_BASE_HREF, useValue: '/'
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
