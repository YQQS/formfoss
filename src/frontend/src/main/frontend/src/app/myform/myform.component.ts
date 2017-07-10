import { Component, OnInit } from '@angular/core';
import {Questionnaire} from "../models/questionnaire";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {QuestionService} from "../services/question.service";

@Component({
    selector: 'app-myforms',
    templateUrl: './myform.component.html',
    styleUrls: ['./myform.component.css']
})
export class MyformComponent implements OnInit {
    users: Questionnaire[];
    selectedQuestionnaire: Questionnaire;

    constructor(private myformService: QuestionService,
                private router: Router) { }

    ngOnInit() {
    }
}
