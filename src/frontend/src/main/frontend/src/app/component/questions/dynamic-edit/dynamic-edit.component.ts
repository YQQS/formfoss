import {Component, Input, OnInit, Output} from '@angular/core';
import {Location} from '@angular/common';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DynamicFormModel} from "../../../models/dynamic-form.model";
import {QuestionService} from "../../../services/question.service";
import {QuestionBase} from "../../../models/question-base";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import {QuestionBuilder} from "../../../services/question-builder";
import {QuestionDropDown} from "../../../models/question-dropdown";

@Component({
    selector: 'dynamic-edit',
    templateUrl: './dynamic-edit.component.html',
    styleUrls: ['./dynamic-edit.component.scss']
})
export class DynamicEditComponent implements OnInit {
    isPreview: boolean = false;

    // the formControlGroup for edit
    @Input() formGroup: FormGroup;

    @Input() formObject: DynamicFormModel;

    // the FormControlGroup for preview
    form: FormGroup;

    checked: boolean;

    controlTypes = ['textbox', 'dropdown', 'slider'];

    constructor(private qtService: QuestionService,
                private location: Location,
                private router: ActivatedRoute) {
    }

    ngOnInit() {

    }

    trackByKey(index: number, question: QuestionBase<any>) {
        return question.key;
    }

    // add a new question behind the given question
    addQuestion(question: QuestionBase<any>) {
        this.sync();

        // get a new question with unique key
        let pos = this.formObject.formItems.indexOf(question);
        let order = question.order;
        let length = this.formObject.formItems.length;
        let newQuestion: QuestionBase<any> = this.qtService
            .getOneQuestion(`question${this.formObject.formItems[length - 1].order + 1}`, order + 1);

        // add a new formControl for the new question
        QuestionBuilder.addEditFormControl(this.formGroup, newQuestion);

        // update question order, the order will change while the key never change
        this.formObject.formItems.forEach((question, index) => {
            if (index > pos ) {
                question.order = question.order + 1;
            }
        });
        this.formObject.formItems.splice(pos + 1 , 0, newQuestion);

    }

    delQuestion(question: QuestionBase<any>) {
        this.sync();

        // remove formControl in formGroup
        let index = this.formObject.formItems.indexOf(question);
        this.formObject.formItems.splice(index, 1);
        this.formGroup.removeControl(question.key);
    }

    onSubmit() {

    }

    reset() {
        this.formObject = null;
        this.ngOnInit();
    }

    preview(){
        if (!this.isPreview) {
            this.sync();
        }
        this.isPreview = !this.isPreview;
        this.form = this.qtService.toFormGroup(this.formObject.formItems);
    }

    saveOrUpdate() {
        if (!this.isPreview) {
            this.sync();
        }
        this.qtService.saveOrUpdate(this.formObject)
            .subscribe(res => {
                alert(res.message);
            }, error => {
                alert(error);
            })
    }

    private sync() {
        this.formObject.formItems.forEach((question, index) => {
            let values = this.formGroup.get(question.key).value;
            question.title = values['title-edit'];
            question.controlType = values['controlType-edit']

            question.validator = {};
            question.validator.required = values['required-edit'];
            switch (question.controlType) {
                case 'textbox':
                    question.validator.minLength = values['minLength-edit'];
                    question.validator.maxLength = values['maxLength-edit'];
                    question.validator.pattern = values['pattern-edit'];
                    break;
                case 'slider':
                    question.validator.min = values['min-edit'];
                    question.validator.max = values['max-edit'];
                    break;
                case 'dropdown':
                    (<QuestionDropDown> question).options = values['options-edit'];
                    break;
            }
        })
    }
}
