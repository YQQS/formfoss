import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {CdkTableModule} from '@angular/cdk';
import {MdTableModule} from '@angular/material';

import {AppComponent } from './app.component';
import {UserService} from './services/user.service';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppRoutingModule} from './app-routing.module';
import {UsersComponent} from './users/users.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
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
import { FormExampleComponent } from './component/form-example/form-example.component';
import 'hammerjs';
import { FormPrototypeComponent } from './component/form-prototype/form-prototype.component';
import { DynamicFormComponent } from './questions/dynamic-form/dynamic-form.component';
import { DynamicQuestionComponent } from './questions/dynamic-question/dynamic-question.component';
import { MyformComponent } from './myform/myform.component';
import { DynamicEditComponent } from './questions/dynamic-edit/dynamic-edit.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        UsersComponent,
        UserDetailComponent,
        FormExampleComponent,
        FormPrototypeComponent,
        DynamicFormComponent,
        DynamicQuestionComponent,
        MyformComponent,
        DynamicEditComponent

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
