import {Component} from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-myform',
    styleUrls: ['./myform.component.css'],
    templateUrl: './myform.component.html',
})
export class MyformComponent {
    displayedColumns = ['QuestionnaireId', 'QuestionnaireName', 'CreatData', 'Account'];
    exampleDatabase = new ExampleDatabase();
    dataSource: ExampleDataSource | null;

    ngOnInit() {
        this.dataSource = new ExampleDataSource(this.exampleDatabase);
    }
}

/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
    'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
    'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
    'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface QuestionnaireData {
    id: string;
    name: string;
    CreatData: string;
    Account: number;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<QuestionnaireData[]> = new BehaviorSubject<QuestionnaireData[]>([]);
    get data(): QuestionnaireData[] { return this.dataChange.value; }

    constructor() {
        // Fill up the database with 100 users.
        for (let i = 0; i < 100; i++) { this.addQuestionnaire(); }
    }

    /** Adds a new user to the database. */
    addQuestionnaire() {
        const copiedData = this.data.slice();
        copiedData.push(this.createNewQuestionnaire());
        this.dataChange.next(copiedData);
    }

    /** Builds and returns a new User. */
    private createNewQuestionnaire() {
        const name =
            NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
            NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

        return {
            id: (this.data.length + 1).toString(),
            name: name,
            CreatData: Math.round(Math.random()).toString(),
            Account: Math.round(Math.random() * (COLORS.length - 1))
        };
    }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
    constructor(private _exampleDatabase: ExampleDatabase) {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<QuestionnaireData[]> {
        return this._exampleDatabase.dataChange;
    }

    disconnect() {}
}
