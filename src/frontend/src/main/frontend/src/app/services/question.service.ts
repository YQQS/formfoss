import {Injectable} from '@angular/core';
import {QuestionBase} from '../models/form/question-base';
import { FormUtil } from '../util/form.util';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormModel} from '../models/form/form.model';
import {Http, Headers, RequestOptions, Response, RequestOptionsArgs} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/throw';
import {AnswerModel} from '../models/answer/answer.model';
import {FormResultModel} from '../models/result/form-result.model';
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
    private publishedUrl = ServiceUtil.publicUrl + '/forms/published';
    private publishedFormurl = ServiceUtil.publicUrl + '/forms/';
    private jsonHeader = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {}


    getOneQuestion(key: string, order: number): QuestionBase<any> {
        const question: QuestionBase<any> =  FormUtil.buildQuestion(this.questionTemp);
        question.order = order ;
        question.key = key;
        return question;
    }

    getStartForm(): FormModel {
        return FormUtil.buildForm(this.startForm);
    }

    saveOrUpdate(form: FormModel) {
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

    saveAnswer(formGroup: FormGroup, formObj: FormModel) {
        const answer = FormUtil.buildAnswerModel(formGroup, formObj);
        answer.commitflag = false;
        return this.http.post(this.answerUrl + '/tempsave', JSON.stringify(answer), ServiceUtil.buildAuthReqOpts())
            .map(res => res.json())
            .catch(ServiceUtil.handleError)
    }

    submitAnswer(formGroup: FormGroup, formObj: FormModel) {
        const answer = FormUtil.buildAnswerModel(formGroup, formObj);
        return this.http.post(this.answerUrl, JSON.stringify(answer), ServiceUtil.buildAuthReqOpts())
            .map(res => FormUtil.buildForm(res.json()) )
            .catch(ServiceUtil.handleError)
    }

    getAll(): Observable<any> {
        return this.http.get(this.formUrl, ServiceUtil.buildAuthReqOpts())
            .map(res => (res.json() as any[])
                .map(item => FormUtil.buildForm(item)))
            .catch(ServiceUtil.handleError)
    }

    getPublished(): Observable<FormModel[]> {
        return this.http.get(this.publishedUrl)
            .map(res => res.json().map(item => FormUtil.buildForm(item)))
            .catch(ServiceUtil.handleError)
    }

    getPublishedById(id: number): Observable<any> {
        return this.http.get(this.publishedFormurl + id)
            .map(res => FormUtil.buildForm(res.json()))
            .catch(ServiceUtil.handleError);
    }

    getForm(id: number): Observable<any> {
        return this.http.get(this.formUrl + '/' + id, ServiceUtil.buildAuthReqOpts())
            .map(res => FormUtil.buildForm(res.json()))
            .catch(ServiceUtil.handleError)
    }

    deleteForm(id: number) {
        return this.http.delete(this.formUrl + '/' + id, ServiceUtil.buildAuthReqOpts())
            .map(res => res.json())
            .catch(ServiceUtil.handleError)
    }

    getUserAnswer(answerId: number): Observable<any> {
        return this.http.get(this.answerUrl + '/answer/' + answerId, ServiceUtil.buildAuthReqOpts())
            .map(res => FormUtil.parseAnswerModel(res.json()) )
            .catch(ServiceUtil.handleError)
    }

    getUserAnswers(formId: number): Observable<any> {
        return this.http.get(this.answerUrl + '/' + formId, ServiceUtil.buildAuthReqOpts())
            .map(res => {
                const answers = res.json() as any[];
                return answers.map(item => FormUtil.parseAnswerModel(item))
            })
            .catch(ServiceUtil.handleError)
    }

    getUserAnswerByFormId(userId: number, formId: number): Observable<any> {
        return this.http.get(this.answerUrl + '/' + userId + '/' + formId, ServiceUtil.buildAuthReqOpts())
            .map(res => FormUtil.parseAnswerModel(res.json()) )
            .catch(ServiceUtil.handleError)
    }

    getFormData(formId: number): Observable<any> {
        return this.http.get(this.dataUrl + '/' + formId, ServiceUtil.buildAuthReqOpts())
            .map(res => FormUtil.parseResultModel(res.json()) )
            .catch(ServiceUtil.handleError)
    }

    publish(uid: number, fid: number) {
        return this.http.patch(this.userUrl + '/' + uid + this.formUrl + '/' + fid, '{}', ServiceUtil.buildAuthReqOpts())
            .map(res => res.json())
            .catch(ServiceUtil.handleError)
    }

}
