import {QuestionBase} from "./question-base";
import {DynamicFormSettings} from './dynamic-form.settings';

export class DynamicFormModel {
    formId?: number;
    userId?: number;
    title: string;
    desc: string;
    isPublished: boolean;
    settings: DynamicFormSettings;
    //ordered question list
    formItems: QuestionBase<any>[];

    constructor(input: {title?: string, desc?: string} = {}) {
        this.title = input.title || '';
        this.desc = input.desc || '';
    }

    addQuestion(question: QuestionBase<any>, index) {
        this.formItems.splice(index, 0, question);
        this.formItems.forEach((qu, i) => {
            if (i > index ) {
                this.formItems[i].order ++;
                this.formItems[i].key = 'question' + this.formItems[i].order;
            }
        })
    }
}
