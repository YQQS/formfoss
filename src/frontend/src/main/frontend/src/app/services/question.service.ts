import {Injectable} from "@angular/core";
import {QuestionBase} from "../questions/question-base";
import {QuestionDropDown} from "../questions/question-dropdown";
import {QuestionTextbox} from '../questions/question-textbox'
import {QuestionSlider} from "../questions/question-slider";
import { QuestionBuilder } from './question-builder';

@Injectable()
export class QuestionService {
    dynamicForm = {
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
            .sort((a,b) => a.order - b.order);
    }
}
