import {Injectable} from "@angular/core";
import {QuestionBase} from "../models/question-base";
import {QuestionDropDown} from "../models/question-dropdown";
import {QuestionTextbox} from '../models/question-textbox'
import { QuestionBuilder } from './question-builder';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DynamicFormModel} from "../models/dynamic-form.model";
import {Http, Headers, RequestOptions, Response, RequestOptionsArgs} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/throw';
import {AnswerModel} from "../models/answer.model";
import {ResultModel} from "../models/result/result.model";
import {ServiceUtil} from '../util/service.util';

@Injectable()
export class QuestionService {
    private startForm = {
        title: 'Title',
        desc: 'Put your description here',
        isPublished: false,
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

    private formUrl = ServiceUtil.authUrl + '/forms';
    private answerUrl = ServiceUtil.authUrl + '/useranswers';
    private dataUrl = ServiceUtil.authUrl + '/formdata';
    private userUrl = ServiceUtil.authUrl + '/users';
    private publishUrl = ServiceUtil.publicUrl + '/forms/published';
    private jsonHeader = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {}


    getOneQuestion(key: string, order: number): QuestionBase<any> {
        const question: QuestionBase<any> =  QuestionBuilder.buildQuestion(this.questionTemp);
        question.order = order ;
        question.key = key;
        return question;
    }

    getStartForm(): DynamicFormModel {
        return QuestionBuilder.buildDynamicForm(this.startForm);
    }

    saveOrUpdate(form: DynamicFormModel) {
        if (form.formId) {
            return this.http.put(this.formUrl, JSON.stringify(form), ServiceUtil.buildAuthReqOpts())
                .map(res => res.json())
                .catch(ServiceUtil.handleError)
        } else {
            return this.http.post(this.formUrl, JSON.stringify(form), ServiceUtil.buildAuthReqOpts())
                .map(res => res.json())
                .catch(ServiceUtil.handleError);
        }
    }

    saveAnswer(formGroup: FormGroup, formObj: DynamicFormModel) {
        const answer = QuestionBuilder.buildAnswerModel(formGroup, formObj);
        answer.commitflag = false;
        return this.http.post(this.answerUrl + '/tempsave', JSON.stringify(answer), ServiceUtil.buildAuthReqOpts())
            .map(res => res.json())
            .catch(ServiceUtil.handleError)
    }

    submitAnswer(formGroup: FormGroup, formObj: DynamicFormModel) {
        const answer = QuestionBuilder.buildAnswerModel(formGroup, formObj);
        return this.http.post(this.answerUrl, JSON.stringify(answer), ServiceUtil.buildAuthReqOpts())
            .map(res => QuestionBuilder.buildDynamicForm(res.json()) )
            .catch(ServiceUtil.handleError)
    }

    getAll(): Observable<DynamicFormModel[]> {
        return this.http.get(this.formUrl, ServiceUtil.buildAuthReqOpts())
            .map(res => (res.json() as any[])
                .map(item => QuestionBuilder.buildDynamicForm(item)))
            .catch(ServiceUtil.handleError)
    }

    getPublished(): Observable<DynamicFormModel[]> {
        return this.http.get(this.publishUrl)
            .map(res => res.json().map(item => QuestionBuilder.buildDynamicForm(item)))
            .catch(ServiceUtil.handleError)
    }

    getForm(id: number): Observable<DynamicFormModel> {
        return this.http.get(this.formUrl + '/' + id, ServiceUtil.buildAuthReqOpts())
            .map(res => QuestionBuilder.buildDynamicForm(res.json()))
            .catch(ServiceUtil.handleError)
    }

    delete(id: number) {
        return this.http.delete(this.formUrl + '/' + id, ServiceUtil.buildAuthReqOpts())
            .map(res => res.json())
            .catch(ServiceUtil.handleError)
    }

    getUserAnswer(answerId: number): Observable<AnswerModel> {
        return this.http.get(this.answerUrl + '/answer/' + answerId, ServiceUtil.buildAuthReqOpts())
            .map(res => QuestionBuilder.parseAnswerModel(res.json()) )
            .catch(ServiceUtil.handleError)
    }

    getUserAnswers(formId: number): Observable<AnswerModel[]> {
        return this.http.get(this.answerUrl + '/' + formId, ServiceUtil.buildAuthReqOpts())
            .map(res => {
                const answers = res.json() as any[];
                return answers.map(item => QuestionBuilder.parseAnswerModel(item))
            })
            .catch(ServiceUtil.handleError)
    }

    getUserAnswerByFormId(userId: number, formId: number): Observable<AnswerModel> {
        return this.http.get(this.answerUrl + '/' + userId + '/' + formId, ServiceUtil.buildAuthReqOpts())
            .map(res => QuestionBuilder.parseAnswerModel(res.json()) )
            .catch(ServiceUtil.handleError)
    }

    getFormData(formId: number): Observable<ResultModel> {
        return this.http.get(this.dataUrl + '/' + formId, ServiceUtil.buildAuthReqOpts())
            .map(res => QuestionBuilder.parseResultModel(res.json()) )
            .catch(ServiceUtil.handleError)
    }

    publish(uid: number, fid: number) {
        return this.http.patch(this.userUrl + '/' + uid + this.formUrl + '/' + fid, '{}',ServiceUtil.buildAuthReqOpts())
            .map(res => res.json())
            .catch(ServiceUtil.handleError)
    }

}
