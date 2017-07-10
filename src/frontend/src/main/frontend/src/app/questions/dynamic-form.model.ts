import {QuestionBase} from "./question-base";
import {DynamicFormSettings} from './dynamic-form.settings';

export class DynamicFormModel {
    id?: number;
    title: string;
    desc: string;
    settings: DynamicFormSettings;
    questions: QuestionBase<any>[];

    constructor(input: {title?: string, desc?: string} = {}) {
        this.title = input.title || '';
        this.desc = input.desc || '';
    }
}
