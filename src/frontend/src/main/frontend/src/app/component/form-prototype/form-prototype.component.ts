import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-form-prototype',
    templateUrl: './form-prototype.component.html',
    styleUrls: ['./form-prototype.component.css']
})
export class FormPrototypeComponent implements OnInit {
    private animals: string[] = [
        "dog",
        "cat",
        "bird",
        "monkey"
    ];
    private selectedAnimal = "";

    constructor() { }

    ngOnInit() {
    }

}
