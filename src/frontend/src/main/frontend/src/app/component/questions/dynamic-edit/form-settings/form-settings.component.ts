import {Component, Input, OnInit} from '@angular/core';
import {DynamicFormSettings} from "../../../../models/dynamic-form.settings";

@Component({
    selector: 'form-settings',
    templateUrl: './form-settings.component.html',
    styleUrls: ['./form-settings.component.scss']
})
export class FormSettingsComponent implements OnInit {
    @Input() settings: DynamicFormSettings;

    constructor() { }

    ngOnInit() {
    }

}
