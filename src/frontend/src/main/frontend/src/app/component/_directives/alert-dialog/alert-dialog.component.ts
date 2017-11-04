import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<AlertDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {message: string}) { }

    ngOnInit() {
    }

    confirm() {
        this.dialogRef.close({
            confirm: true
        })
    }

    cancel() {
        this.dialogRef.close({
            confirm: false
        })
    }

}
