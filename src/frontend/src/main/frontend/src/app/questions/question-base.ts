import {QuestionValidator} from "./question-validator";
export class QuestionBase<T> {
    value: T;
    key: string;
    label: string;
    order: number;
    controlType: string;
    validator?: QuestionValidator;

    constructor(options: {
        value?: T,
        key?: string,
        label?: string,
        order?: number,
        controlType?: string,
        validator? : {}
    } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.validator = options.validator || {};
    }
}