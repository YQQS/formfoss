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
import {ResultAnswerBase} from "../models/result/result.answer-base";
import {ResultModel} from "../models/result/result.model";

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
    private formUrl = '/forms';
    private answerUrl = '/useranswers';
    private dataUrl = '/formdata';
    private userUrl='/users';
    private jsonHeader = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {}


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
            return this.http.put(this.formUrl, JSON.stringify(form), {headers: this.jsonHeader})
                .map(res => res.json())
                .catch(this.handleError)
        } else {
            return this.http.post(this.formUrl, JSON.stringify(form), {headers: this.jsonHeader})
                .map(res => res.json())
                .catch(this.handleError);
        }
    }

    saveAnswer(formGroup: FormGroup, formObj: DynamicFormModel) {
        let answer = QuestionBuilder.buildAnswerModel(formGroup, formObj);
        answer.commitflag = false;
        return this.http.post(this.answerUrl + '/tempsave', JSON.stringify(answer), {headers: this.jsonHeader})
            .map(res => res.json())
            .catch(this.handleError)
    }

    submitAnswer(formGroup: FormGroup, formObj: DynamicFormModel) {
        let answer = QuestionBuilder.buildAnswerModel(formGroup, formObj);
        answer.commitflag = true;
        return this.http.post(this.answerUrl, JSON.stringify(answer), {headers: this.jsonHeader})
            .map(res => res.json())
            .catch(this.handleError)
    }

    getAll() {
        return this.http.get(this.formUrl)
            .map(res => res.json() as DynamicFormModel[])
            .catch(this.handleError)
    }

    getForm(id: number): Observable<DynamicFormModel> {
        return this.http.get(this.formUrl + '/' + id)
            .map(res => QuestionBuilder.buildDynamicForm(res.json()))
            .catch(this.handleError)
    }

    delete(id: number) {
        return this.http.delete(this.formUrl + '/' + id)
            .map(res => res.json())
            .catch(this.handleError)
    }

    getUserAnswer(answerId: number): Observable<AnswerModel> {
        return this.http.get(this.answerUrl + '/answer/' + answerId)
            .map(res => QuestionBuilder.parseAnswerModel(res.json()) )
            .catch(this.handleError)
    }

    getUserAnswerByFormId(userId: number, formId: number): Observable<AnswerModel> {
        return this.http.get(this.answerUrl + '/' + userId + '/' + formId)
            .map(res => QuestionBuilder.parseAnswerModel(res.json()) )
            .catch(this.handleError)
    }

    getFormData(formId: number): Observable<ResultModel> {
        return this.http.get(this.dataUrl + '/' + formId)
            .map(res => QuestionBuilder.parseResultModel(res.json()) )
            .catch(this.handleError)
    }

    publish(uid:number ,fid:number) {
        return this.http.patch(this.userUrl+'/'+uid+this.formUrl+'/'+fid,"{}",{headers: this.jsonHeader})
            .map(res=>res.json())
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
