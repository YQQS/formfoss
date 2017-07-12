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

    buildQuestion(question: QuestionBase<any>) {
        let pos = this.formObject.formItems.indexOf(question);
        this.formObject.formItems[pos] =
            QuestionBuilder.buildQuestion(question);

        // restore options from formGroup
        if (this.formObject.formItems[pos] instanceof QuestionDropDown) {
            (this.formObject.formItems[pos] as QuestionDropDown).options = [];
            let options = this.formGroup.get(question.key).value['options-edit'];
            Object.keys(options).forEach(
               key => {
                   (this.formObject.formItems[pos] as QuestionDropDown)
                       .options.push({
                            key: key,
                            value: options[key]
                   })
               }
           )
        }
    }

    onSubmit() {

    }

    addOption(question: QuestionDropDown) {
        let index: number = this.formObject.formItems.indexOf(question);
        let size: number = (<QuestionDropDown> this.formObject.formItems[index]).options.length;
        let newKey: number;
        if (size === 0) {
            newKey = 1;
        } else {
            newKey = parseInt((<QuestionDropDown> this.formObject.formItems[index]).options[size - 1]
                .key.replace(/[^0-9]/g, '')) + 1;
        }
        let keyStr: string = `option${newKey}`;

        (this.formGroup.get(question.key).get('options-edit') as FormGroup)
            .addControl(keyStr, new FormControl('Option Description'));

        (<QuestionDropDown> (this.formObject.formItems[index])).options.push({
            key: keyStr,
            value: 'Option Description'
        });

    }

    delOption(question: QuestionBase<any>, pos: number) {
        let index = this.formObject.formItems.indexOf(question);
        let optKey = (<QuestionDropDown> question).options[pos].key;

        (<QuestionDropDown> this.formObject.formItems[index]).options.splice(pos, 1);
        (this.formGroup.get(question.key).get('options-edit') as FormGroup)
            .removeControl(optKey);
    }

    trackOption(index: number, option: {key: string, value: string}) {
        return option.key;
    }

    reset() {
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
                    let keys: string[] = Object.keys(values['options-edit']);
                    (question as QuestionDropDown).options = [];
                    keys.forEach(key => {
                        (question as QuestionDropDown).options.push({
                            key: key,
                            value: values['options-edit'][key]
                        });
                    });
                    break;
            }
        })
    }
}
