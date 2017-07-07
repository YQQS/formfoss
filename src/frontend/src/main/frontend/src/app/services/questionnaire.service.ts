/**
 * Created by Lenovo on 2017/7/7.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Questionnaire } from '../models/questionnaire';
@Injectable()
export class QuestionnaireService {
    getHeroes() { return HEROES; }
}
