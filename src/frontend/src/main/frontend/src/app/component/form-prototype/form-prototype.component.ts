import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-form-prototype',
    templateUrl: './form-prototype.component.html',
    styleUrls: ['./form-prototype.component.scss']
})
export class FormPrototypeComponent implements OnInit {
    animals: string[] = [
        'dog',
        'cat',
        'bird',
        'monkey',
        'ant'
    ];
    selectedAnimal = '';
    animalList: string[] = [];
    counts = 0;
    words: string = '';
    selectedDate: Date;

    updateMultiSelect(elements) {
        this.animalList = [];
        console.log(elements);
        for (let i = 0; i < elements.options.length; i++) {
            this.animalList.push(elements.options.indexOf(i));
        }
    }

    constructor() { }

    updateCount(): void {
        this.counts = this.words.length;
    }
    ngOnInit() {
    }
}
