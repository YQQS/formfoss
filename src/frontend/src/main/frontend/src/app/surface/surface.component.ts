import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'app-surface',
    templateUrl: './surface.component.html',
    styleUrls: ['./surface.component.css']
})
export class SurfaceComponent implements OnInit {
    constructor(
                private userService: UserService,
                private router: Router
               ) { }

   /* login(username: string, password: string) {
        return this.userService.login(username, password)
            .toPromise()
            .then(res => {
                if (res.errorMsg) {
                    alert(res.errorMsg);
                } else {
                    this.router.navigate(['/list']);
                }
                return res;
            });
    }*/
    ngOnInit() {
    }

}
