import {QuestionBase} from "./question-base";

export class QuestionTextbox extends QuestionBase<string> {
    controlType = 'textbox';
    // the type inside input. e.g. email, password, text
    // inputType: string;

    constructor(options: {} = {}) {
        super(options);
    }

}