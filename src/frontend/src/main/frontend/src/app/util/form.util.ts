import {QuestionBase} from '../models/form/question-base';
import {QuestionTextbox} from '../models/form/question-textbox';
import {QuestionSlider} from '../models/form/question-slider';
import {QuestionDropDown} from '../models/form/question-dropdown';
import {FormModel} from '../models/form/form.model';
import {AnswerModel} from '../models/answer/answer.model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {AnswerTextbox} from '../models/answer/answer-textbox';
import {AnswerSlider} from '../models/answer/answer-slider';
import {AnswerSingleChoice} from '../models/answer/answer-singleChoice';
import {AnswerMultiChoice} from '../models/answer/answer-multiChoice';
import {FossValidators} from '../validator/foss.validator';
import {FormResultModel} from '../models/result/form-result.model';
import {ChartModel} from '../models/result/chart.model';
import {QuestionResultModel} from '../models/result/question-result.model';
import {ServiceUtil} from './service.util';
import {noUndefined} from '@angular/compiler/src/util';
import {AnswerBase} from '../models/answer/answer-base';

export class FormUtil {
    static savedForm = 'savedForm';

    static buildQuestion(input: {}): QuestionBase<any> {
        const cType = input['controlType'];
        if (cType == null) {
            return null;
        }
        switch (cType) {
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


    static buildForm(input: any): FormModel {
        let form: FormModel = new FormModel();
        if (input.formId) {
            form.formId = input.formId;
        }
        if (input.userId) {
            form.userId = input.userId;
        }
        form.title = input['title'] || '';
        form.desc = input['desc'] || '';
        form.isPublished = input['isPublished'] || false;
        form.settings = input['settings'] || {};
        form.formItems = input['formItems']
            .map(question => FormUtil.buildQuestion(question))
            .sort((a, b) => a.order - b.order);
        return form;
    }

    static parseAnswerModel(input: any): AnswerModel {
        let answerModel: AnswerModel = new AnswerModel(input);
        answerModel.answers = answerModel.answers.map(item => {
            switch (item.type) {
                case 'multiChoice':
                    return new AnswerMultiChoice(item);
                case 'singleChoice':
                    return new AnswerSingleChoice(item);
                case 'slider':
                    return new AnswerSlider(item);
                case 'textbox':
                    return new AnswerTextbox(item);
            }
        });

        return answerModel;
    }

    static buildResultModel(input: any): FormResultModel {
        let result: FormResultModel = new FormResultModel(input);

        return result;
    }

    static toChartModel(questionData: QuestionResultModel, questionSchema: QuestionBase<any>): ChartModel {
        let chartModel = new ChartModel();
        chartModel.options = {
            responsive: true
        };
        switch (questionData.type) {
            case 'dropdown':
                chartModel.type = 'pie';
                chartModel.title = questionSchema.title;
                chartModel.label = (questionSchema as QuestionDropDown).options
                    .map(item => item.value);
                chartModel.data = questionData.result
                    .map(item => item.choiceCount);
                chartModel.dataSets = [{data: chartModel.data, label: chartModel.title}];

                // let maxData: number = chartModel.data.sort((a,b) => b - a)[0];
                chartModel.options = {
                    responsive: true
                    /*
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                max: maxData
                            }
                        }]
                    }
                    */
                };
                break;

            case 'slider':
                chartModel.title = questionSchema.title;
                break;
        }

        return chartModel;
    }

    static toChartModels(questionData: FormResultModel, questionSecheme: FormModel): ChartModel[] {
        let charts: ChartModel[] = [];
        let len = questionData.data.length;
        let i = 0;
        for (i = 0; i < len; i++) {
            charts.push(FormUtil.toChartModel(questionData.data[i],
                questionSecheme.formItems[i]));
        }

        return charts;
    }


    static buildAnswerModel(formGroup: FormGroup, formObject: FormModel) {
        let answerModel = new AnswerModel({formId: formObject.formId});
        answerModel.userId = ServiceUtil.getCurrentUser().userId;
        answerModel.answers = [];
        formObject.formItems.forEach(question => {
            answerModel.answers.push(FormUtil.buildSingleAnswer(formGroup, question))
        });

        return answerModel;
    }

    static buildSingleAnswer(formGroup: FormGroup, question: QuestionBase<any>) {
        if (question instanceof QuestionTextbox) {
            return new AnswerTextbox({key: question.key, answer: formGroup.value[question.key]});
        } else if (question instanceof QuestionSlider) {
            return new AnswerSlider({key: question.key, answer: formGroup.value[question.key]});
        } else if (question instanceof QuestionDropDown) {
            if (question.multiple) {
                return new AnswerMultiChoice({
                    key: question.key,
                    answer: (formGroup.get(question.key).get('normal').value as any[])
                        .map((item, i) => {
                            if (item !== false) {
                                return question.options[i].key;
                            } else {
                                return '';
                            }
                        })
                        .filter(item => item !== ''),
                    other: formGroup.get(question.key).get('other').value
                })
            } else {
                return new AnswerSingleChoice({
                    key: question.key,
                    answer: formGroup.get(question.key).get('normal').value,
                    other: formGroup.get(question.key).get('other').value
                })
            }
        } else {
            return null;
        }
    }

    static formModelToEditGroup(form: FormModel): FormGroup {
        const questions = form.formItems;
        let group: FormGroup = new FormGroup({
            'title': new FormControl(form.title, Validators.required),
            'desc': new FormControl(form.desc),
        });

        questions.forEach(question => {
            FormUtil.addFormEditControl(group, question);
        });

        return group;
    }

    static addFormEditControl(formGroup: FormGroup, question: QuestionBase<any>) {
        let group: FormGroup = new FormGroup({});
        let optLength = 0;

        if (question instanceof QuestionDropDown) {
            question.options.forEach(option => {
                group.addControl(option.key, new FormControl(option.value || '', Validators.required));
            });
            optLength = question.options.length;
        }


        formGroup.addControl(question.key, new FormGroup({
                'title-edit': new FormControl(question.title, Validators.required),
                'controlType-edit': new FormControl(question.controlType, Validators.required),
                'required-edit': new FormControl(question.validator.required || false),
                'validator-edit': new FormControl(question.validator !== null, Validators.required),
                'depends-edit': new FormControl(question.dependencies.hasOwnProperty('key')),
                'dependency-edit': new FormGroup({
                    'key': new FormControl(question.dependencies['key'] || ''),
                    'requiredOptions': new FormControl(question.dependencies['requiredOptions'] || [])
                }),
                'min-edit': new FormControl(question.validator.min || 0),
                'max-edit': new FormControl(question.validator.max || 100),
                'minLength-edit': new FormControl(question.validator.minLength || 10),
                'maxLength-edit': new FormControl(question.validator.maxLength || 255),
                'type-edit': new FormControl(question.validator.type || 'text'),
                'pattern-edit': new FormControl(question.validator.pattern || ''),
                'multiple-edit': new FormControl(question['multiple'] || false),
                'minSelect-edit': new FormControl(question.validator.minSelect || (question.validator.required ? 1 : 0),
                    Validators.min(0)),
                'maxSelect-edit': new FormControl(question.validator.maxSelect || optLength,
                    Validators.min(0)),
                'options-edit': group
            }, Validators.compose([FossValidators.noLargerValidator, FossValidators.editMaxSelect])
        ));
    }

    static formModelToViewGroup(questions: QuestionBase<any>[], answer?: AnswerModel) {
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
            } else if (question instanceof QuestionSlider) {
                if (question.validator.min) {
                    validatorsList.push(Validators.min(question.validator.min));
                }
                if (question.validator.max) {
                    validatorsList.push(Validators.max(question.validator.max));
                }
            }

            let questionFormControl;
            if (answer !== undefined && answer !== null) {
                let ans = FormUtil.getAnswerOfKey(answer, question.key);

                if (question instanceof QuestionDropDown && question.multiple) {
                    questionFormControl = new FormGroup({
                        'normal': new FormArray(
                            FormUtil.multiChoiceAnswerToSelect(question, ans.answer || []).map(s => new FormControl(s)),
                            Validators.compose([
                                FossValidators.maxSelect(question.validator.maxSelect),
                                FossValidators.minSelect(question.validator.minSelect)
                            ])),
                        'other': new FormControl((ans as AnswerMultiChoice).other || '')
                    });
                } else if (question instanceof QuestionDropDown) {
                    questionFormControl = new FormGroup({
                        'normal': new FormControl(ans.answer || question.value, validatorsList),
                        'other': new FormControl((ans as AnswerSingleChoice).other || '')
                    })
                } else {
                    questionFormControl = new FormControl(ans.answer || question.value, validatorsList);
                }

            } else {
                if (question instanceof QuestionDropDown && question.multiple) {
                    questionFormControl = new FormGroup({
                        'normal': new FormArray(
                            question.options.map(s => new FormControl(false)),
                            Validators.compose([
                                FossValidators.maxSelect(question.validator.maxSelect),
                                FossValidators.minSelect(question.validator.minSelect)
                            ])),
                        'other': new FormControl('')
                    });
                } else if (question instanceof QuestionDropDown) {
                    questionFormControl = new FormGroup({
                        'normal': new FormControl(question.value, validatorsList),
                        'other': new FormControl('')
                    })
                } else {
                    questionFormControl = new FormControl(question.value, validatorsList);
                }
            }

            group.addControl(question.key, questionFormControl);
        });

        return group;
    }

    static formEditGroupSyncToModel(group: FormGroup, form: FormModel) {
        const values = group.value;
        form.title = values['title'];
        form.desc = values['desc'];
        form.formItems.forEach((question) => {
            const options = group.get(question.key).value;
            question.title =  options['title-edit'];
            question.controlType =  options['controlType-edit'];

            if (options['depends-edit'] === false || options['required-edit'] === true) {
                question.dependencies = null;
            } else {
                const key = options['dependency-edit']['key'];
                const requireds = options['dependency-edit']['requiredOptions'];
                question.dependencies = {
                    key: key,
                    requiredOptions: requireds
                }
            }

            question.validator = {};
            question.validator.required =  options['required-edit'];
            if ( options['validator-edit'] === false) {
                return;
            }
            switch (question.controlType) {
                case 'textbox':
                    question.validator.minLength =  options['minLength-edit'];
                    question.validator.maxLength =  options['maxLength-edit'];
                    question.validator.pattern =  options['pattern-edit'];
                    break;
                case 'slider':
                    question.validator.min =  options['min-edit'];
                    question.validator.max =  options['max-edit'];
                    break;
                case 'dropdown':
                    question.validator.minSelect =  options['minSelect-edit'];
                    question.validator.maxSelect =  options['maxSelect-edit'];
                    (question as QuestionDropDown).multiple =  options['multiple-edit'];
                    const keys: string[] = Object.keys( options['options-edit']);
                    (question as QuestionDropDown).options = [];
                    keys.forEach(key => {
                        (question as QuestionDropDown).options.push({
                            key: key,
                            value:  options['options-edit'][key]
                        });
                    });
                    break;
            }
        })
    }

    static storeFormModel(form: FormModel) {
        localStorage.setItem(
            FormUtil.savedForm,
            JSON.stringify(form)
        );
    }



    static retrieveFormModel(): FormModel {
        const obj = localStorage.getItem(FormUtil.savedForm);
        if (obj !== null) {
            return FormUtil.buildForm(JSON.parse(obj));
        }

        return null;
    }

    static getAnswerOfKey(answer: AnswerModel, key: string): AnswerBase<any> {
        if (answer === null) {
            return null;
        }

        const an = answer.answers.find(item => item.key === key);
        if (an !== null) {
            return an;
        } else {
            return null;
        }
    }

    static multiChoiceSelectToAnswer(question: QuestionDropDown, selected: boolean[], other?: string): AnswerMultiChoice {
        const length = question.options.length;
        let hasOther = false;
        if (question.options[length - 1].key === 'other') {
            hasOther = true;
        }

        let answer = [];
        selected.forEach((item, i) => {
            if (item !== false) {
                answer.push(question.options[i].key);
            }
        });

        return new AnswerMultiChoice({
            answer: answer,
            other: other
        });
    }

    static multiChoiceAnswerToSelect(question: QuestionDropDown, selected: string[]): boolean[] {
        return question.options.map(item => {
            return selected.includes(item.key)
        });
    }

    static getOptionValueFromKey(source: {key: string, value: string}[], key: string) {
        if (source.length === 0) {
            return null;
        }

        const res = source.find(item => item.key === key);
        if (res === null || res === undefined) {
            return null;
        }

        return res.value;
    }

    static getOptionValueListFromKey(source: {key: string, value: string}[], keys: string[]) {
        return keys.map(item => FormUtil.getOptionValueFromKey(source, item));
    }
}
