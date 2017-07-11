import { QuestionBase } from '../models/question-base';
import { QuestionTextbox } from '../models/question-textbox';
import { QuestionSlider } from '../models/question-slider';
import { QuestionDropDown } from '../models/question-dropdown';
import { QuestionValidator } from '../models/question-validator';
import {DynamicFormModel}  from '../models/dynamic-form.model';
import {AnswerModel} from "../models/answer.model";
import {FormGroup} from "@angular/forms";
import {AnswerBase} from "../models/answer-base";
import {AnswerTextbox} from "../models/answer-textbox";
import {AnswerSlider} from "../models/answer-slider";
import {AnswerDropdown} from "../models/anwser-dropdown";
import {instantiateSupportedAnimationDriver} from "@angular/platform-browser/animations/src/providers";

export class QuestionBuilder {
    static buildQuestion(input: any): QuestionBase<any> {
        switch (input.controlType) {
            case 'textbox':
                return new QuestionTextbox(input);
            case 'dropdown':
                return new QuestionDropDown(input);
            case 'slider':
                return new QuestionSlider(input);
            default:
                return null;
        }
    }


    static buildDynamicForm(input: any): DynamicFormModel {
        let dyForm: DynamicFormModel = new DynamicFormModel();
        if (input.formId) {
            dyForm.formId = input.formId;
        }
        if (input.userId) {
            dyForm.userId = input.userId;
        }
        dyForm.title = input['title'] || '';
        dyForm.desc = input['desc'] || '';
        dyForm.settings = input['settings'] || {};
        dyForm.formItems = input['formItems']
            .map(question => QuestionBuilder.buildQuestion(question))
            .sort((a,b) => a.order - b.order);
        return dyForm;
    }

    static buildAnswerModel(formGroup: FormGroup, formObject: DynamicFormModel){
        let answerModel = new AnswerModel({formId: formObject.formId});
        if (formObject.userId) {
            answerModel.userId = formObject.userId;
        }
        answerModel.answers =[];
        formObject.formItems.forEach(question => {
            answerModel.answers.push(QuestionBuilder.buildSingleAnswer(formGroup, question))
        });

        return answerModel;
    }

    static buildSingleAnswer(formGroup: FormGroup, question: QuestionBase<any>) {
        if (question instanceof QuestionTextbox) {
            return new AnswerTextbox({key: question.key, answer: formGroup.value[question.key]});
        }
        else if (question instanceof QuestionSlider) {
            return new AnswerSlider({key: question.key, answer: formGroup.value[question.key]});
        }
        else if (question instanceof QuestionDropDown) {
            if (question.multiple) {
                return new AnswerDropdown({
                    type: "multiChoice",
                    key: question.key,
                    answer: formGroup.value[question.key]
                });
            } else {
                return new AnswerDropdown({
                    type: 'singleChoice',
                    key: question.key,
                    answer: formGroup.value[question.key]
                });
            }
        }
        else {
            return null;

        }
    }

}
