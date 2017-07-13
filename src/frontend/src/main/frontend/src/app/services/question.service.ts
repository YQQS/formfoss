import {Injectable} from "@angular/core";
import {QuestionBase} from "../models/question-base";
import {QuestionDropDown} from "../models/question-dropdown";
import {QuestionTextbox} from '../models/question-textbox'
import {QuestionSlider} from "../models/question-slider";
import { QuestionBuilder } from './question-builder';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DynamicFormModel} from "../models/dynamic-form.model";
import {Http, Headers, RequestOptions, Response, RequestOptionsArgs} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/throw';
import {AnswerModel} from "../models/answer.model";

@Injectable()
export class QuestionService {
    private startForm = {
        title: 'Title',
        desc: 'Put your description here',
        settings: {},
        formItems: [
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
        order: -1,
        inputType: 'text',
        validator: {}
    };

    private dynamicForm = {
        title: 'the first dynamic form',
        desc: 'welcome here',
        settings: {},
        formItems: [
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

    private url = '/forms';
    private answerUrl = '/useranswers';
    private dataUrl = '/formdata';
    private jsonHeader = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {}

    getDynamicFormModel() {
        return QuestionBuilder.buildDynamicForm(this.dynamicForm);
    }

    getQuestions() {
//        return this.questions.sort((a,b) => a.order - b.order)
        return this.dynamicForm.formItems
            .map(qust => QuestionBuilder.buildQuestion(qust))
            .sort((a, b) => a.order - b.order);
    }

    getOneQuestion(key: string, order: number) {
        let question: QuestionBase<any> =  QuestionBuilder.buildQuestion(this.questionTemp);
        question.order = order ;
        question.key = key;
        return question;
    }

    getStartForm() {
        return QuestionBuilder.buildDynamicForm(this.startForm);
    }

    saveOrUpdate(form: DynamicFormModel) {
        if (form.formId) {
            return this.http.put(this.url, JSON.stringify(form), {headers: this.jsonHeader})
                .map(res => res.json())
                .catch(this.handleError)
        } else {
            return this.http.post(this.url, JSON.stringify(form), {headers: this.jsonHeader})
                .map(res => res.json())
                .catch(this.handleError);
        }
    }

    saveAnswer(formGroup: FormGroup, formObj: DynamicFormModel) {
        let answer = QuestionBuilder.buildAnswerModel(formGroup, formObj);
        return this.http.post(this.answerUrl + '/tempsave', JSON.stringify(answer), {headers: this.jsonHeader})
            .map(res => res.json())
            .catch(this.handleError)
    }

    submitAnswer(formGroup: FormGroup, formObj: DynamicFormModel) {
        let answer = QuestionBuilder.buildAnswerModel(formGroup, formObj);
        return this.http.post(this.answerUrl, JSON.stringify(answer), {headers: this.jsonHeader})
            .map(res => res.json())
            .catch(this.handleError)
    }

    getAll() {
        return this.http.get(this.url)
            .map(res => res.json() as DynamicFormModel[])
            .catch(this.handleError)
    }

    getForm(id: number): Observable<DynamicFormModel> {
        return this.http.get(this.url + '/' + id)
            .map(res => QuestionBuilder.buildDynamicForm(res.json()))
            .catch(this.handleError)
    }

    delete(id: number) {
        return this.http.delete(this.url + '/' + id)
            .map(res => res.json())
            .catch(this.handleError)
    }

    private handleError(error: Response | any)  {
        let errMsg: string;
        if (error instanceof Response) {
            console.error(error.text());
            const body = error.json() || '';
            const err = body.errorMsg || JSON.stringify(error);
            errMsg =`${error.status} - ${error.statusText || ''}: ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}
