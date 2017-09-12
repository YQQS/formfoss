import {Component, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {QuestionService} from '../../../../services/question.service';
import {FormModel} from '../../../../models/form/form.model';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {MdDialog} from '@angular/material';
import {SubmitPreviewComponent} from '../form-submit-preview/submit-preview.component';
import {AlertService} from '../../../../services/alert.service';
import {AuthenticatedUser} from '../../../../models/authenticatedUser';
import {ServiceUtil} from '../../../../util/service.util';
import {FormUtil} from '../../../../util/form.util';
import {QuestionBase} from '../../../../models/form/question-base';

@Component({
    selector: 'app-form-view',
    templateUrl: './form-view.component.html',
    styleUrls: ['./form-view.component.scss']
})
export class FormViewComponent implements OnInit {
    // @Input() questions: QuestionBase<any>[] = [];
    @Input() formObject: FormModel;
    @Input() formGroup: FormGroup;
    currentUser: AuthenticatedUser;

    constructor(
                private alertService: AlertService,
                ) { }

    ngOnInit() {
        if (!this.formObject.isPublished) {
            this.alertService.error('form not published');
        }
    }

    getDependQuestion(question: QuestionBase<any>): QuestionBase<any> {
        if ( question.dependencies && question.dependencies.key) {
            return this.formObject.formItems.find(q => q.key === question.dependencies.key);
        } else {
            return null;
        }
    }


}
