import {AnswerBase} from "./answer-base";
export class AnswerDropdown extends AnswerBase<string[]> {
    constructor(input: {
        type: string,
        answer?: string[],
        key?: string,
        id?: number
    }) {
        super(input);
    }
}
