import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

@Component({
    selector: 'app-submit-preview',
    templateUrl: './submit-preview.component.html',
    styleUrls: ['./submit-preview.component.scss']
})
export class SubmitPreviewComponent implements OnInit {

    constructor(public dialogRef: MdDialogRef<SubmitPreviewComponent>,
                @Inject(MD_DIALOG_DATA) public data: any) { }

    ngOnInit() {
    }

    keys() {
        return Object.keys(this.data);
    }

    confirm() {
        this.dialogRef.close({
            confirm: true
        });
    }

    back() {
        this.dialogRef.close({
            confirm: false
        })
    }
}
