import { QuestionBase } from '../models/question-base';
import { QuestionTextbox } from '../models/question-textbox';
import { QuestionSlider } from '../models/question-slider';
import { QuestionDropDown } from '../models/question-dropdown';
import { QuestionValidator } from '../models/question-validator';
import {DynamicFormModel}  from '../models/dynamic-form.model';
import {AnswerModel} from "../models/answer.model";
import {FormGroup} from "@angular/forms";

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

    }

}
