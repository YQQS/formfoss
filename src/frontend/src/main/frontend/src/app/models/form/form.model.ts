import {QuestionBase} from './question-base';
import {FormSettingsModel} from './form-settings.model';

export class FormModel {
    formId?: number;
    userId?: number;
    title: string;
    desc: string;
    isPublished: boolean;
    settings: FormSettingsModel;
    // ordered question list
    formItems: QuestionBase<any>[];

    constructor(input: {title?: string, desc?: string} = {}) {
        this.title = input.title || '';
        this.desc = input.desc || '';
    }

}
