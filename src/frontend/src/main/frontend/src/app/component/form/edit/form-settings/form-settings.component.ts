import {Component, Input, OnInit} from '@angular/core';
import {FormSettingsModel} from '../../../../models/form/form-settings.model';

@Component({
    selector: 'app-form-settings',
    templateUrl: './form-settings.component.html',
    styleUrls: ['./form-settings.component.scss']
})
export class FormSettingsComponent implements OnInit {
    @Input() settings: FormSettingsModel;

    constructor() { }

    ngOnInit() {
    }

}
