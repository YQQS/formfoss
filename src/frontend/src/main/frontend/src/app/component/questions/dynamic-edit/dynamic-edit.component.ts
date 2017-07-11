import {Component, Input, OnInit, Output} from '@angular/core';
import {Location} from '@angular/common';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DynamicFormModel} from "../../../models/dynamic-form.model";
import {QuestionService} from "../../../services/question.service";
import {QuestionBase} from "../../../models/question-base";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'dynamic-edit',
    templateUrl: './dynamic-edit.component.html',
    styleUrls: ['./dynamic-edit.component.scss']
})
export class DynamicEditComponent implements OnInit {
    // going deprecated
    isPreview: boolean = false;

    @Input() formGroup: FormGroup;

    @Input() formObject: DynamicFormModel;

    form: FormGroup;

    controlTypes = ['textbox', 'dropdown', 'slider'];

    constructor(private qtService: QuestionService,
                private location: Location,
                private router: ActivatedRoute) {
    }

    ngOnInit() {

    }

    addQuestion(question: QuestionBase<any>) {
        this.sync();

        let order = question.order;
        let newQuestion: QuestionBase<any> = this.qtService.getOneQuestion(order + 1);
        this.formObject.formItems.forEach((question, index) => {
            if (index >= order ) {
                question.order = question.order + 1;
                question.key = 'question' + question.order;
            }
        });
        this.formObject.formItems.splice(order , 0, newQuestion);

        /*
        let questionsList = this.formGroup.get('questions');
        if (questionsList instanceof FormGroup) {
            questionsList.addControl(newQuestion.key, new FormGroup({
                'title-edit': new FormControl(newQuestion.title, Validators.required),
                'controlType-edit': new FormControl(newQuestion.controlType, Validators.required)
            }));
        }
        this.formGroup.setControl('questions', questionsList);
        */
        this.formGroup = this.qtService.toFromEditGroup(this.formObject);
        console.log(this.formGroup.controls.questions)

    }

    delQuestion(question: QuestionBase<any>) {

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

    save() {
        this.qtService.save(this.formObject)
            .subscribe(res => {
                console.log('saved');
                alert(res.message);
            }, error => {
                alert(error);
            })
    }

    private sync() {
        this.formObject.formItems.forEach((question, index) => {
            question.title = this.formGroup.get('formItems').get(question.key).value['title-edit'];
            question.controlType = this.formGroup.get('formItems').get(question.key).value['controlType-edit']
        })
    }
}
