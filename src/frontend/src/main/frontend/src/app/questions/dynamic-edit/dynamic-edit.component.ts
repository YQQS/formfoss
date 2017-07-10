import {Component, Input, OnInit, Output} from '@angular/core';
import {Location} from '@angular/common';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DynamicFormModel} from "../dynamic-form.model";
import {QuestionService} from "../../services/question.service";
import {QuestionBase} from "../question-base";

@Component({
    selector: 'dynamic-edit',
    templateUrl: './dynamic-edit.component.html',
    styleUrls: ['./dynamic-edit.component.scss']
})
export class DynamicEditComponent implements OnInit {
    @Input() formGroup: FormGroup;
    @Input() @Output() formObject: DynamicFormModel;

    controlTypes = ['textbox', 'dropdown', 'slider'];

    constructor(private qtService: QuestionService,
                private location: Location) {
    }

    ngOnInit() {
        if (!this.formObject)
            this.formObject = this.qtService.getStartForm();
        this.formGroup = this.qtService.toFromEditGroup(this.formObject);
    }

    addQuestion(question: QuestionBase<any>) {
        let newQuestion: QuestionBase<any> = this.qtService.getOneQuestion(question.order);
        let questionsList = this.formGroup.get('questions');
        if (questionsList instanceof FormGroup) {
            questionsList.addControl(newQuestion.key, new FormGroup({
                'title-edit': new FormControl(question.title, Validators.required),
                'controlType-edit': new FormControl('dropdown')
            }));
        }
        this.formGroup.setControl('questions', questionsList);
        this.formObject.questions.push(newQuestion);
    }

    delQuestion(question: QuestionBase<any>) {

    }

    onSubmit() {

    }

    preview(){}

    save() {}
}
