import {getMdInputContainerMissingMdInputError} from "@angular/material";
export interface QuestionValidator {
    required?: boolean;
    // designed for text input
    min?: number;
    max?: number;
    pattern?: string;
    type?: string;

    // designed for number input
    minLength?: number;
    maxLength?: number;

    /*
    constructor(input: {} = {}) {
        this.required = input['required'] || false;
        this.min = input['min'] || 0;
        this.max = input['max'] || null;
        this.pattern = input['pattern'] || '';
        this.type = input['type'] || '';
        this.minLength = input['minLength'] || null;
        this.maxLength = input['maxLength'] || null;
    }
    */
}