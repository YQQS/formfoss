import {Component, Input, OnInit, Output} from '@angular/core';
import {Location} from '@angular/common';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormModel} from '../../../../models/form/form.model';
import {QuestionService} from '../../../../services/question.service';
import {QuestionBase} from '../../../../models/form/question-base';
import {ActivatedRoute, ParamMap, Route, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {FormUtil} from '../../../../util/form.util';
import {QuestionDropDown} from '../../../../models/form/question-dropdown';
import {MdDialog, MdSelectChange, MdSlideToggleChange} from '@angular/material';
import {AlertDialogComponent} from '../../../_directives/alert-dialog/alert-dialog.component';
import {AlertService} from '../../../../services/alert.service';
import {ServiceUtil} from '../../../../util/service.util';
import {noUndefined} from '@angular/compiler/src/util';

@Component({
    selector: 'app-form-structure-edit',
    templateUrl: './form-structure-edit.component.html',
    styleUrls: ['./form-structure-edit.component.scss']
})
export class FormStructureEditComponent implements OnInit {
    isPreview = false;

    // the formControlGroup for edit
    @Input() formEditGroup: FormGroup;

    @Input() formObject: FormModel;

    // the FormControlGroup for preview
    formViewGroup: FormGroup;

    updated = false;

    controlTypes = ['textbox', 'dropdown', 'slider'];

    constructor(private qtService: QuestionService,
                public diaRef: MdDialog,
                private route: Router,
                private activatedRoute: ActivatedRoute,
                private alertService: AlertService) {
    }

    ngOnInit() {
        if (this.formObject.isPublished) {
            this.alertService.error('be careful, you are editing a published form');
        }
        if (ServiceUtil.isAdmin() &&
            ServiceUtil.getCurrentUser().userId !== this.formObject.userId) {
            this.alertService.error('As an admin, you are editing a form does not created by yourself');
        }
    }

    indexOf(question: QuestionBase<any>) {
        return this.formObject.formItems.indexOf(question);
    }

    PreviousQuestionKeys(question: QuestionBase<any>) {
        const pos = this.formObject.formItems.indexOf(question);
        return this.formObject.formItems
            .filter((q, i) => i < pos)
            .map(q => q.key);
    }

    getQuestionControl(key: string) {
        return this.formEditGroup.get(key);
    }

    getDependQuestionControl(thisQuestion: QuestionBase<any>) {
        const key = this.formEditGroup.get(thisQuestion.key).get('dependency-edit').get('key').value;

        if (key === null) {
            return null;
        }

        return this.getQuestionControl(key);
    }

    getDependQuestionOptionKey(thisQuestion: QuestionBase<any>) {
        return Object.keys(
            this.getDependQuestionControl(thisQuestion)
                .get('options-edit').value);
    }

    getDependQuestionOptionValue(thisQuestion: QuestionBase<any>, key: string) {
        return this.getDependQuestionControl(thisQuestion)
            .get('options-edit').value[key];
    }

    trackByKey(index: number, question: QuestionBase<any>) {
        return question.key;
    }

    // add a new question behind the given question
    addQuestion(question?: QuestionBase<any>) {
        this.sync();

        // get a new question with unique key
        const pos = this.formObject.formItems.indexOf(question);
        const order = question ? question.order : 0;
        const length = this.formObject.formItems.length;
        const maxOrder = length ? this.formObject.formItems[length - 1].order : 0;
        const newQuestion: QuestionBase<any> = this.qtService
            .getOneQuestion(`question${maxOrder + 1}`, order + 1);

        // add a new formControl for the new question
        FormUtil.addFormEditControl(this.formEditGroup, newQuestion);

        // update question order, the order will change while the key never change
        this.formObject.formItems.forEach((item, index) => {
            if (index > pos ) {
                item.order = item.order + 1;
            }
        });
        this.formObject.formItems.splice(pos + 1 , 0, newQuestion);

    }

    delQuestion(question: QuestionBase<any>) {
        this.sync();

        // remove formControl in formGroup
        const index = this.formObject.formItems.indexOf(question);
        this.formObject.formItems.splice(index, 1);
        this.formEditGroup.removeControl(question.key);
    }

    buildQuestion(question: QuestionBase<any>, event: MdSelectChange) {
        this.updated =  true;

        const pos = this.formObject.formItems.indexOf(question);
        question.controlType = event.value;
        this.formObject.formItems[pos] = FormUtil.buildQuestion(question);

        // restore options from formGroup
        if (this.formObject.formItems[pos] instanceof QuestionDropDown) {
            (this.formObject.formItems[pos] as QuestionDropDown).multiple =
                this.formEditGroup.get(question.key).value['multiple-edit'];

            (this.formObject.formItems[pos] as QuestionDropDown).options = [];
            const options = this.formEditGroup.get(question.key).value['options-edit'];
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

    changeMode(event: MdSlideToggleChange) {
        if (!this.isPreview) {
            this.sync();
            this.formViewGroup = FormUtil.formModelToViewGroup(this.formObject.formItems);
        }
        this.isPreview = event.checked;
    }

    addOption(question: QuestionDropDown) {
        this.updated = true;

        const index: number = this.formObject.formItems.indexOf(question);
        const size: number = (<QuestionDropDown> this.formObject.formItems[index]).options.length;
        let newKey: number;
        if (size === 0) {
            newKey = 1;
        } else {
            newKey = parseInt((<QuestionDropDown> this.formObject.formItems[index]).options[size - 1]
                .key.replace(/[^0-9]/g, '')) + 1;
        }
        let keyStr = `option${newKey}`;

        (this.formEditGroup.get(question.key).get('options-edit') as FormGroup)
            .addControl(keyStr, new FormControl('Option Description'));

        (<QuestionDropDown> (this.formObject.formItems[index])).options.push({
            key: keyStr,
            value: 'Option Description'
        });

    }

    delOption(question: QuestionBase<any>, pos: number) {
        this.updated = true;

        const index = this.formObject.formItems.indexOf(question);
        let optKey = (<QuestionDropDown> question).options[pos].key;

        (<QuestionDropDown> this.formObject.formItems[index]).options.splice(pos, 1);
        (this.formEditGroup.get(question.key).get('options-edit') as FormGroup)
            .removeControl(optKey);
    }

    otherOption(question: QuestionBase<any>) {
        const index = this.indexOf(question);

        (this.formEditGroup.get(question.key).get('options-edit') as FormGroup)
            .addControl('other', new FormControl('other'));
        (this.formObject.formItems[index] as QuestionDropDown).options.push({
            key: 'other',
            value: 'other'
        });
    }

    hasOtherOption(question: QuestionDropDown) {
        return question.options.filter(opt => opt.key === 'other').length !== 0 ;
    }

    getControl(question: QuestionBase<any>) {
        return this.formEditGroup.get(question.key);
    }

    settings() {

    }

    isQuestionRequired(key: string) {
        return this.getQuestionControl(key).get('required-edit').value === true;
    }

    trackOption(index: number, option: {key: string, value: string}) {
        return option.key;
    }

    reset() {
    }

    confirmAndSave() {
        let dialogRef;
        if (this.updated && this.formObject.isPublished && this.formObject.formId) {
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
        this.qtService.saveOrUpdateForm(this.formObject)
            .subscribe(res => {
                this.route.navigate(['/question', 'list'])
                    .then(() => this.alertService.success(res['message']));
            }, (error: string) => {
                this.alertService.error(error);
            })
    }

    publish() {
        this.sync();
        this.qtService.publish(this.formObject.formId)
            .subscribe(res => {
                this.alertService.success(res.message || 'published');
            }, error => this.alertService.error(error));
    }

    private sync() {
      FormUtil.formEditGroupSyncToModel(this.formEditGroup, this.formObject);
    }

}
