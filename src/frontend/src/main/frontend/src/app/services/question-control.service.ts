import {Injectable} from "@angular/core";
import {QuestionBase} from "../questions/question-base";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {QuestionTextbox} from "../questions/question-textbox";
import {QuestionDropDown} from "../questions/question-dropdown";
import {QuestionSlider} from "../questions/question-slider";

@Injectable()
export class QuestionControlService {
    constructor() {}

    toFormGroup(questions: QuestionBase<any>[]) {
        let group = new FormGroup({});

        questions.forEach(question => {
            let validatorsList: any[] = question.validator.required ?
                [Validators.required] : [];

            if (question instanceof QuestionTextbox) {
                if (question.validator.minLength) {
                    validatorsList.push(Validators.minLength(question.validator.minLength));
                }
                if (question.validator.maxLength) {
                    validatorsList.push(Validators.maxLength(question.validator.maxLength));
                }
                if (question.validator.pattern) {
                    validatorsList.push(Validators.pattern(question.validator.pattern));
                }
                if (question.validator.type === 'email') {
                    validatorsList.push(Validators.email);
                }
            }
            else if (question instanceof QuestionSlider) {
                if (question.validator.min) {
                    validatorsList.push(Validators.min(question.validator.min));
                }
                if (question.validator.max) {
                    validatorsList.push(Validators.max(question.validator.max));
                }
            }

            let questionFormControl = new FormControl(question.value, validatorsList);
            group.addControl(question.key, questionFormControl);
        });

        return group;
    }
}
