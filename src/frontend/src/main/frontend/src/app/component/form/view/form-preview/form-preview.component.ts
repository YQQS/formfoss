import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {Location} from '@angular/common';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {FormModel} from '../../../../models/form/form.model';
import {QuestionService} from '../../../../services/question.service';
import {FormGroup} from '@angular/forms';
import {FormUtil} from '../../../../util/form.util';
import {AlertService} from '../../../../services/alert.service';
import {AuthenticatedUser} from '../../../../models/authenticatedUser';
import {ServiceUtil} from '../../../../util/service.util';

@Component({
    selector: 'app-form-preview',
    templateUrl: './form-preview.component.html',
    styleUrls: ['./form-preview.component.scss']
})
export class FormPreviewComponent implements OnInit {
    formObject: FormModel;
    formGroup: FormGroup;
    currentUser: AuthenticatedUser;

    constructor(private activatedRoute: ActivatedRoute,
                private location: Location,
                private router: Router,
                private qtService: QuestionService,
                private alertService: AlertService) { }

    ngOnInit() {
        this.currentUser = ServiceUtil.getCurrentUser();
        const isPublished = this.activatedRoute.snapshot.queryParams['isPublished'] || false;
        const formId = +this.activatedRoute.snapshot.params['id'];

        if (isPublished) {
            this.qtService.getPublishedById(formId)
                .subscribe(res => {
                    this.formObject = res;
                    this.formGroup = FormUtil.formModelToViewGroup(this.formObject.formItems);
                }, error => this.alertService.error(error));
        } else {
            this.qtService.getForm(formId)
                .subscribe(res => {
                    this.formObject = res;
                    this.formGroup = FormUtil.formModelToViewGroup(this.formObject.formItems);
                }, error => this.alertService.error(error));
        }
    }

    goBack() {
        this.location.back();
    }

    edit() {
        this.router.navigate(['question', this.formObject.formId, 'edit']);
    }

}
