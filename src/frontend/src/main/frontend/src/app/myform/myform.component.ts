import { Component,OnInit} from '@angular/core';
declare var $:any;
import {QuestionService} from "../services/question.service";
import {DynamicFormModel} from '../questions/dynamic-form.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
    selector: 'app-myform',
    templateUrl: './myform.component.html',
    styleUrls: ['./myform.component.css']
})
export class MyformComponent implements OnInit{
    errorMessage: string;
    dynamicform:DynamicFormModel[];

    constructor (private qusetionService: QuestionService) {}
    ngOnInit(){}
}
