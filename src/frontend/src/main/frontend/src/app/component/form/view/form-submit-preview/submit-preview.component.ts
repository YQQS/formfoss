import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {FormModel} from '../../../../models/form/form.model';
import {AnswerModel} from '../../../../models/answer/answer.model';

@Component({
    selector: 'app-submit-preview',
    templateUrl: './submit-preview.component.html',
    styleUrls: ['./submit-preview.component.scss']
})
export class SubmitPreviewComponent implements OnInit {

    constructor(public dialogRef: MdDialogRef<SubmitPreviewComponent>,
                @Inject(MD_DIALOG_DATA) public data: {
                    form: FormModel,
                    answer: AnswerModel
                }) { }

    ngOnInit() {
    }

    confirm() {
        this.dialogRef.close({
            confirm: true
        });
    }

    back() {
        this.dialogRef.close({
            confirm: false
        });
    }
}
