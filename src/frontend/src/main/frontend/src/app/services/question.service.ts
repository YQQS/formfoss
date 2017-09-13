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
import {ServiceUtil} from '../util/service.util';
import {AnswerModel} from '../models/answer/answer.model';

@Injectable()
export class QuestionService {

    private static startForm: FormModel = {
        formId: null,
        userId: null,
        title: 'Title',
        desc: 'Put your description here',
        isPublished: false,
        settings: {},
        formItems: [
            {
                key: 'question1',
                controlType: 'textbox',
                title: 'question title',
                value: '',
                desc: '',
                inputType: 'text',
                order: 1,
                validator: {
                    required: true
                }
            }
        ]
    };

    private static questionTemp = {
        key: 'question',
        controlType: 'textbox',
        title: 'Title',
        value: '',
        order: -1,
        inputType: 'text',
        validator: {}
    };

    private formUrl = ServiceUtil.authUrl + '/forms';
    private answerUrl = ServiceUtil.authUrl + '/useranswers';
    private answerSaveUrl = ServiceUtil.authUrl + '/useranswers/save';
    private dataUrl = ServiceUtil.authUrl + '/formdata';
    private userUrl = ServiceUtil.authUrl + '/users';
    private publicFormUrl = ServiceUtil.publicUrl + '/forms/';

    private jsonHeader = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {}


    getOneQuestion(key: string, order: number): QuestionBase<any> {
        const question: QuestionBase<any> =  FormUtil.buildQuestion(QuestionService.questionTemp);
        question.order = order ;
        question.key = key;
        return question;
    }

    getStartForm(): FormModel {
        return FormUtil.buildForm(QuestionService.startForm);
    }

    saveOrUpdateForm(form: FormModel) {
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

    saveAnswer(answer: AnswerModel) {
        answer.commitflag = false;
        return this.http.post(this.answerUrl + '/save', JSON.stringify(answer), ServiceUtil.buildAuthReqOpts())
            .map(res => res.json())
            .catch(ServiceUtil.handleError)
    }

    submitAnswer(answer: AnswerModel) {
        return this.http.post(this.answerUrl, JSON.stringify(answer), ServiceUtil.buildAuthReqOpts())
            .map(res => res.json() )
            .catch(ServiceUtil.handleError)
    }

    getAllForms(): Observable<any> {
        return this.http.get(this.formUrl, ServiceUtil.buildAuthReqOpts())
            .map(res => (res.json() as any[])
                .map(item => FormUtil.buildForm(item)))
            .catch(ServiceUtil.handleError)
    }

    getFormsByUserId(userId: number): Observable<any> {
        const url = this.userUrl + '/' + userId + '/forms';
        return this.http.get(url, ServiceUtil.buildAuthReqOpts())
            .map((res: Response) => {
                return (res.json() as any[]).map(
                    item => FormUtil.buildForm(item));
            })
            .catch(ServiceUtil.handleError);
    }

    getPublishedForms(): Observable<FormModel[]> {
        return this.http.get(this.publicFormUrl + 'published')
            .map(res => res.json().map(item => FormUtil.buildForm(item)))
            .catch(ServiceUtil.handleError)
    }

    getPublishedFormById(formId: number): Observable<any> {
        return this.http.get(this.publicFormUrl + formId)
            .map(res => FormUtil.buildForm(res.json()))
            .catch(ServiceUtil.handleError);
    }

    getFormByFormId(formId: number): Observable<any> {
        return this.http.get(this.formUrl + '/' + formId, ServiceUtil.buildAuthReqOpts())
            .map(res => FormUtil.buildForm(res.json()))
            .catch(ServiceUtil.handleError)
    }

    deleteForm(formId: number) {
        return this.http.delete(this.formUrl + '/' + formId, ServiceUtil.buildAuthReqOpts())
            .map(res => res.json())
            .catch(ServiceUtil.handleError)
    }

    getAnswerByAnswerId(answerId: number): Observable<any> {
        const url = this.answerUrl + `?answerId=${answerId}`;
        return this.http.get(url, ServiceUtil.buildAuthReqOpts())
            .map(res => FormUtil.parseAnswerModel(res.json()) )
            .catch(ServiceUtil.handleError)
    }

    deleteAnswerByAnswerId(answerId: number): Observable<any> {
        const url = this.answerUrl + `/${answerId}`;
        return this.http.delete(url, ServiceUtil.buildAuthReqOpts())
            .map(res => res.json())
            .catch(ServiceUtil.handleError);
    }

    getAnswerByFormId(formId: number): Observable<any> {
        const url = this.answerUrl + `?formId=${formId}`;
        return this.http.get(url, ServiceUtil.buildAuthReqOpts())
            .map(res => FormUtil.parseAnswerModel(res.json()) )
            .catch(ServiceUtil.handleError)
    }

    getAllAnswersOfForm(formId: number): Observable<any> {
        const url = this.formUrl + `/${formId}/answers`;
        return this.http.get(url, ServiceUtil.buildAuthReqOpts())
            .map(res => {
                const answers = res.json() as any[];
                return answers.map(item => FormUtil.parseAnswerModel(item))
            })
            .catch(ServiceUtil.handleError)
    }

    getAnswerListOfUser(userId: number, isSubmitted?: boolean): Observable<any> {
        let url = ServiceUtil.authUrl + '/users/' + userId + '/answers';
        if (isSubmitted !== null) {
            url += `?submitted=${isSubmitted}`;
        }

        return this.http.get(url, ServiceUtil.buildAuthReqOpts())
            .map(res => (res.json() as any[]).map(item => FormUtil.parseAnswerModel(item)))
            .catch(ServiceUtil.handleError);
    }

    getAnsweredFormListOfUser(userId: number) {
        const url = ServiceUtil.authUrl + '/users/' + userId + '/answeredForms';

        return this.http.get(url, ServiceUtil.buildAuthReqOpts())
            .map(res => (res.json() as any[]).map(item => FormUtil.buildForm(item)))
            .catch(ServiceUtil.handleError);
    }

    getFormData(formId: number): Observable<any> {
        return this.http.get(this.dataUrl + '/' + formId, ServiceUtil.buildAuthReqOpts())
            .map(res => FormUtil.buildResultModel(res.json()) )
            .catch(ServiceUtil.handleError)
    }

    publish(fid: number) {
        return this.http.patch(this.formUrl + '/' + fid, '{}', ServiceUtil.buildAuthReqOpts())
            .map(res => res.json())
            .catch(ServiceUtil.handleError)
    }

}
