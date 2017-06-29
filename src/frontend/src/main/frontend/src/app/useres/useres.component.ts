import { Component, OnInit } from '@angular/core';
import {User} from "../models/user";

@Component({
    selector: 'app-useres',
    templateUrl: './useres.component.html',
    styleUrls: ['./useres.component.css']
})
export class UseresComponent implements OnInit {
    useres: User[];
    selectedUser: User;

    constructor() { }

    ngOnInit() {
    }

}
