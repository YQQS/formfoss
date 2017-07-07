import {Injectable} from "@angular/core";
import {QuestionBase} from "../questions/question-base";
import {QuestionDropDown} from "../questions/question-dropdown";
import {QuestionTextbox} from '../questions/question-textbox'
import {QuestionSlider} from "../questions/question-slider";
import { QuestionBuilder } from './question-builder';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DynamicFormModel} from "../questions/dynamic-form.model";

@Injectable()
export class QuestionService {
    private startForm = {
        title: 'Title',
        desc: 'Put your description here',
        settings: {},
        questions: [
            {
                key: 'question1',
                controlType: 'textbox',
                title: 'start question title',
                value: '',
                inputType: 'text',
                order: 1,
                validator: {
                    required: true
                }
            }
        ]
    };

    private questionTemp = {
        key: 'question',
        controlType: 'textbox',
        title: 'Template Title',
        value: '',
        order: 1,
        inputType: 'text',
        validator: {}
    };

    private dynamicForm = {
        title: 'the first dynamic form',
        desc: 'welcome here',
        settings: {},
        questions: [
            {
                key: 'brave',
                title: 'Bravery Rating',
                controlType: 'dropdown',
                multiple: true,
                options: [
                    {key: 'solid', value: 'solid'},
                    {key: 'great', value: 'Great'},
                    {key: 'good', value: 'Good'},
                    {key: 'unproven', value: 'Unproven'}
                ],
                order: 3,
                validator: {
                    required: true
                }
            },
            {
                key: 'firstName',
                title: 'First name',
                controlType: 'textbox',
                value: 'Bombasto',
                inputType: 'text',
                order: 1,
                validator: {
                    required: true,
                    minLength: 3
                }
            },
            {
                key: 'emailAddress',
                title: 'Email',
                controlType: 'textbox',
                inputType: 'email',
                order: 2,
                validator: {
                    required: true,
                    type: 'email'
                }
            },
            {
                key: 'password',
                inputType: 'password',
                title: 'the password',
                controlType: 'textbox',
                type: 'password',
                order: 4,
                validator: {
                    required: true,
                    minLength: 8
                }
            },
            {
                key: 'score',
                title: 'score',
                controlType: 'slider',
                value: 55,
                order: 5,
                validator: {
                    min: 0,
                    max: 99,
                    required: true
                }
            }
        ]
    };

    getDynamicFormModel() {
        return QuestionBuilder.buildDynamicForm(this.dynamicForm);
    }

    getQuestions() {
//        return this.questions.sort((a,b) => a.order - b.order)
        return this.dynamicForm.questions
            .map(qust => QuestionBuilder.buildQuestion(qust))
            .sort((a, b) => a.order - b.order);
    }

    getOneQuestion(order?: number) {
        let question: QuestionBase<any> =  QuestionBuilder.buildQuestion(this.questionTemp);
        if (order) {
            question.order = order + 1;
            question.key = `question${ order+1 }`;
        }
        return question;
    }

    getStartForm() {
        return QuestionBuilder.buildDynamicForm(this.startForm);
    }

    toFormGroup(questions: QuestionBase<any>[]) {
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

            let questionFormControl = new FormControl(question.value, validatorsList);
            group.addControl(question.key, questionFormControl);
        });

        return group;

    }

    toFromEditGroup(form: DynamicFormModel) {
        let questions = form.questions;
        let group: FormGroup = new FormGroup({});
        let count: number = 0;

        questions.forEach(question => {
            group.addControl(question.key, new FormGroup({
                'title-edit': new FormControl(question.title, Validators.required),
                'controlType-edit': new FormControl('dropdown', Validators.required)
            }) );
        });

        return new FormGroup({
            'title': new FormControl(form.title, Validators.required),
            'desc':  new FormControl(form.desc),
            'questions': group
        });
    }
}
