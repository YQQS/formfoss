import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {CdkTableModule} from '@angular/cdk';
import {MdTableModule} from '@angular/material';

import {AppComponent } from './app.component';
import {UserService} from './services/user.service';
import {LoginComponent} from './component/users/login/login.component';
import {RegisterComponent} from './component/users/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppRoutingModule} from './app-routing.module';
import {UsersComponent} from './component/users/users.component';
import { UserDetailComponent } from './component/users/user-detail/user-detail.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MdAutocompleteModule, MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdDatepickerModule,
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
<<<<<<< HEAD
import { DynamicFormComponent } from './questions/dynamic-form/dynamic-form.component';
import { DynamicQuestionComponent } from './questions/dynamic-question/dynamic-question.component';
import { MyformComponent } from './myform/myform.component';
import { DynamicEditComponent } from './questions/dynamic-edit/dynamic-edit.component';
=======
import { DynamicFormComponent } from './component/questions/dynamic-form/dynamic-form.component';
import { DynamicQuestionComponent } from './component/questions/dynamic-question/dynamic-question.component';
import { DynamicEditComponent } from './component/questions/dynamic-edit/dynamic-edit.component';
import {QuestionService} from "./services/question.service";
import { QuestionListComponent } from './component/questions/question-list/question-list.component';
import { FormPreviewComponent } from './component/questions/dynamic-form/form-preview/form-preview.component';
import { FormEditComponent } from './component/questions/dynamic-edit/form-edit/form-edit.component';
import { FormNewComponent } from './component/questions/dynamic-edit/form-new/form-new.component';
>>>>>>> dc58f249575accdbcbe0d420a658e235b02a85ae

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        UsersComponent,
        UserDetailComponent,
        FormPrototypeComponent,
        DynamicFormComponent,
        DynamicQuestionComponent,
<<<<<<< HEAD
        MyformComponent,
        DynamicEditComponent

=======
        DynamicEditComponent,
        QuestionListComponent,
        QuestionListComponent,
        FormPreviewComponent,
        FormEditComponent,
        FormNewComponent
>>>>>>> dc58f249575accdbcbe0d420a658e235b02a85ae
    ],
    imports: [
        CdkTableModule,
        MdTableModule,
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
        MdIconModule,
        MdProgressBarModule,
        MdProgressSpinnerModule,
        MdDialogModule,
        MdTooltipModule,
        MdSnackBarModule
    ],
    providers: [UserService],
    bootstrap: [AppComponent]
})
export class AppModule { }
