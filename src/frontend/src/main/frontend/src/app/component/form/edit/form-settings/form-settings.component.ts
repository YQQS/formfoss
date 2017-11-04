import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormSettingsModel} from '../../../../models/form/form-settings.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-form-settings',
    templateUrl: './form-settings.component.html',
    styleUrls: ['./form-settings.component.scss']
})
export class FormSettingsComponent implements OnInit {
    settings: FormSettingsModel;

    constructor(
        public diaRef: MatDialogRef<FormSettingsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {settings: FormSettingsModel}
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
