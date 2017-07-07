import {QuestionBase} from "./question-base";

export class QuestionTextbox extends QuestionBase<string> {
    controlType: string = 'textbox';
    //the type inside input. e.g. email, password, text
    inputType: string;

    constructor(options: {} = {}) {
        super(options);
        this.inputType = options['inputType'] || '';
    }

}