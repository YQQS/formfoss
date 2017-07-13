import { QuestionBase } from '../models/question-base';
import { QuestionTextbox } from '../models/question-textbox';
import { QuestionSlider } from '../models/question-slider';
import { QuestionDropDown } from '../models/question-dropdown';
import {DynamicFormModel}  from '../models/dynamic-form.model';
import {AnswerModel} from "../models/answer.model";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {AnswerTextbox} from "../models/answer-textbox";
import {AnswerSlider} from "../models/answer-slider";
import {AnswerSingleChoice} from "../models/answer-singleChoice";
import {AnswerMultiChoice} from "../models/answer-multiChoice";

export class QuestionBuilder {
    static buildQuestion(input: any): QuestionBase<any> {
        switch (input.controlType) {
            case 'textbox':
                return new QuestionTextbox(input);
            case 'dropdown':
                return new QuestionDropDown(input);
            case 'slider':
                return new QuestionSlider(input);
            default:
                return null;
        }
    }


    static buildDynamicForm(input: any): DynamicFormModel {
        let dyForm: DynamicFormModel = new DynamicFormModel();
        if (input.formId) {
            dyForm.formId = input.formId;
        }
        if (input.userId) {
            dyForm.userId = input.userId;
        }
        dyForm.title = input['title'] || '';
        dyForm.desc = input['desc'] || '';
        dyForm.settings = input['settings'] || {};
        dyForm.formItems = input['formItems']
            .map(question => QuestionBuilder.buildQuestion(question))
            .sort((a,b) => a.order - b.order);
        return dyForm;
    }

    static buildAnswerModel(formGroup: FormGroup, formObject: DynamicFormModel){
        let answerModel = new AnswerModel({formId: formObject.formId});
        if (formObject.userId) {
            answerModel.userId = formObject.userId;
        }
        answerModel.answers =[];
        formObject.formItems.forEach(question => {
            answerModel.answers.push(QuestionBuilder.buildSingleAnswer(formGroup, question))
        });

        return answerModel;
    }

    static buildSingleAnswer(formGroup: FormGroup, question: QuestionBase<any>) {
        if (question instanceof QuestionTextbox) {
            return new AnswerTextbox({key: question.key, answer: formGroup.value[question.key]});
        }
        else if (question instanceof QuestionSlider) {
            return new AnswerSlider({key: question.key, answer: formGroup.value[question.key]});
        }
        else if (question instanceof QuestionDropDown) {
            if (question.multiple) {
                return new AnswerMultiChoice({
                    key: question.key,
                    answer: (formGroup.value[question.key] as any[])
                        .map((item,i) => {
                            if (item != false) {
                                return question.options[i].key;
                            } else {
                                return '';
                            }
                        })
                        .filter(item => item != '')
                })
            }
            else {
                return new AnswerSingleChoice({
                    key: question.key,
                    answer: formGroup.value[question.key]
                })
            }
        }
        else {
            return null;
        }
    }

    static addEditFormControl(formGroup: FormGroup, question: QuestionBase<any>) {
        let group: FormGroup = new FormGroup({});
        if (question.controlType === 'dropdown') {
            (question as QuestionDropDown).options.forEach(option => {
                group.addControl(option.key, new FormControl(option.value || '', Validators.required));
            })
        }

        formGroup.addControl(question.key, new FormGroup({
            'title-edit': new FormControl(question.title, Validators.required),
            'controlType-edit': new FormControl(question.controlType, Validators.required),
            'required-edit': new FormControl(question.validator.required || false),
            'min-edit': new FormControl(question.validator.min || 0),
            'max-edit': new FormControl(question.validator.max || 100),
            'minLength-edit': new FormControl(question.validator.minLength || 10),
            'maxLength-edit': new FormControl(question.validator.maxLength || 255),
            'type-edit': new FormControl(question.validator.type || 'text'),
            'pattern-edit': new FormControl(question.validator.pattern || ''),
            'multiple-edit': new FormControl(question['multiple'] || false),
            'options-edit': group
        }));
    }

    static toFormGroup(questions: QuestionBase<any>[]) {
        let group = new FormGroup({});

        questions.forEach(question => {
            let validatorsList: any[] = question.validator.required ?
                [Validators.required] : [];

            if (question instanceof QuestionTextbox) {
                if (question.validator.minLength) {
                    validatorsList.push(Validators.minLength(question.validator.minLength));
                }
                if (question.validator.maxLength) {
                    validatorsList.push(Validators.maxLength(question.validator.maxLength));
                }
                if (question.validator.pattern) {
                    validatorsList.push(Validators.pattern(question.validator.pattern));
                }
                if (question.validator.type === 'email') {
                    validatorsList.push(Validators.email);
                }
            }
            else if (question instanceof QuestionSlider) {
                if (question.validator.min) {
                    validatorsList.push(Validators.min(question.validator.min));
                }
                if (question.validator.max) {
                    validatorsList.push(Validators.max(question.validator.max));
                }
            }

            let questionFormControl;
            if (question instanceof QuestionDropDown && question.multiple) {
                questionFormControl = new FormArray(question.options
                    .map(opt => new FormControl(opt.key)) );
            } else {
                questionFormControl = new FormControl(question.value, validatorsList);
            }
            group.addControl(question.key, questionFormControl);
        });

        return group;

    }

    static toEditFromGroup(form: DynamicFormModel): FormGroup {
        let questions = form.formItems;
        let group: FormGroup = new FormGroup({
            'title': new FormControl(form.title, Validators.required),
            'desc':  new FormControl(form.desc),
        });


        questions.forEach(question => {
            QuestionBuilder.addEditFormControl(group, question);
        });

        return group;
    }
}
