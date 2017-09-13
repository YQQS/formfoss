import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormSettingsModel} from '../../../../models/form/form-settings.model';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';

@Component({
    selector: 'app-form-settings',
    templateUrl: './form-settings.component.html',
    styleUrls: ['./form-settings.component.scss']
})
export class FormSettingsComponent implements OnInit {
    settings: FormSettingsModel;

    constructor(
        public diaRef: MdDialogRef<FormSettingsComponent>,
        @Inject(MD_DIALOG_DATA) public data: {settings: FormSettingsModel}
    ) {
        this.settings = data.settings;
    }

    ngOnInit() {
    }

    confirm() {
        this.diaRef.close({
            confirm: true,
            settings: this.settings
        });
    }

    cancel() {
        this.diaRef.close({
            confirm: false
        })
    }
}
