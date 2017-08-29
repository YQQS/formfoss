import {Component, Input, OnInit, Output} from '@angular/core';
import {Location} from '@angular/common';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FormModel} from "../../../../models/form/form.model";
import {QuestionService} from "../../../../services/question.service";
import {QuestionBase} from "../../../../models/form/question-base";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import {FormUtil} from "../../../../util/form.util";
import {QuestionDropDown} from "../../../../models/form/question-dropdown";
import {MdDialog} from "@angular/material";
import {AlertDialogComponent} from "../../../_directives/alert-dialog/alert-dialog.component";

@Component({
    selector: 'app-form-structure-edit',
    templateUrl: './form-structure-edit.component.html',
    styleUrls: ['./form-structure-edit.component.scss']
})
export class FormStructureEditComponent implements OnInit {
    isPreview = false;

    // the formControlGroup for edit
    @Input() formGroup: FormGroup;

    @Input() formObject: FormModel;

    // the FormControlGroup for preview
    form: FormGroup;

    updatedQuestion: boolean = false;

    controlTypes = ['textbox', 'dropdown', 'slider'];

    constructor(private qtService: QuestionService,
                public diaRef: MdDialog,
                private router: ActivatedRoute) {
    }

    ngOnInit() {

    }

    trackByKey(index: number, question: QuestionBase<any>) {
        return question.key;
    }

    // add a new question behind the given question
    addQuestion(question?: QuestionBase<any>) {
        this.sync();

        // get a new question with unique key
        let pos = this.formObject.formItems.indexOf(question);
        let order = question ? question.order : 0;
        let length = this.formObject.formItems.length;
        let maxOrder = length ? this.formObject.formItems[length-1].order : 0;
        let newQuestion: QuestionBase<any> = this.qtService
            .getOneQuestion(`question${maxOrder + 1}`, order + 1);

        // add a new formControl for the new question
        FormUtil.addFormEditControl(this.formGroup, newQuestion);

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
        this.updatedQuestion =  true;

        let pos = this.formObject.formItems.indexOf(question);
        this.formObject.formItems[pos] =
            FormUtil.buildQuestion(question);

        // restore options from formGroup
        if (this.formObject.formItems[pos] instanceof QuestionDropDown) {
            (this.formObject.formItems[pos] as QuestionDropDown).multiple =
                this.formGroup.get(question.key).value['multiple-edit'];

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
        this.updatedQuestion = true;

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
        this.updatedQuestion = true;

        let index = this.formObject.formItems.indexOf(question);
        let optKey = (<QuestionDropDown> question).options[pos].key;

        (<QuestionDropDown> this.formObject.formItems[index]).options.splice(pos, 1);
        (this.formGroup.get(question.key).get('options-edit') as FormGroup)
            .removeControl(optKey);
    }

    settings() {

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
        this.form = FormUtil.toFormViewGroup(this.formObject.formItems);
    }

    confirmAndSave() {
        let dialogRef;
        if (this.updatedQuestion && this.formObject.isPublished && this.formObject.formId) {
            dialogRef = this.diaRef.open(AlertDialogComponent, {
                data: {
                    message: 'Change to a published form may result in unexpected error, continue?'
                }
            });

            dialogRef.afterClosed()
                .subscribe(data => {
                    if (data.confirm) {
                        this.saveOrUpdate();
                    }
                })
        } else {
            this.saveOrUpdate();
        }

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

    publish() {
        this.qtService.publish(this.formObject.userId, this.formObject.formId)
            .subscribe(res=>{
                if(res.message && res.url) {
                    alert(res.message+".You can release your form throw url:"+res.url);
                }
                else if(res.message){
                    alert(res.message);
                }
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
                    question.validator.minSelect = values['minSelect-edit'];
                    question.validator.maxSelect = values['maxSelect-edit'];
                    (question as QuestionDropDown).multiple = values['multiple-edit'];
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
