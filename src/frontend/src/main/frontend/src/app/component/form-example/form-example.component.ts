import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';

@Component({
    selector: 'app-form-example',
    templateUrl: './form-example.component.html',
    styleUrls: ['./form-example.component.css']
})
export class FormExampleComponent {
    checked = false;
    indeterminate = false;
    align = 'start';
    disabled = false;

    stateCtrl: FormControl;
    filteredStates: any;

    states = [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
    ];

    animals = [
        'dog',
        'cat',
        'bird'
    ];

    constructor() {
        this.stateCtrl = new FormControl();
        this.filteredStates = this.stateCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));
    }

    filterStates(val: string) {
        return val ? this.states.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
            : this.states;
    }

}
