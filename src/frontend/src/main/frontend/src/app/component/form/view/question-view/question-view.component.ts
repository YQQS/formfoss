import {Component, Input, OnInit} from '@angular/core';
import {QuestionBase} from '../../../../models/form/question-base';
import {FormArray, FormGroup} from '@angular/forms';
import {QuestionDropDown} from '../../../../models/form/question-dropdown';

@Component({
    selector: 'app-question-view',
    templateUrl: './question-view.component.html',
    styleUrls: ['./question-view.component.scss']
})
export class QuestionViewComponent implements OnInit {
    @Input() question: QuestionBase<any>;
    @Input() formGroup: FormGroup;
    @Input() dependQuestion: QuestionBase<any>;

    static matchAny(source: string | string[], selected: string[] | string): boolean {
        if (selected === null) {
            return false;
        }

        if (source === null || source.length === 0) {
            return true;
        }

        if (typeof source === 'string' && typeof selected === 'string') {
            return source === selected;
        } else if (typeof source === 'string') {
            return selected.includes(source);
        } else if (typeof selected === 'string') {
            return source.includes(selected);
        } else {
            let match = false;
            selected.forEach(s => {
                if (source.includes(s)) {
                    match = true;
                }
            });

            return match;
        }

    }

    getErrors() {
        return this.formGroup.get(this.question.key).errors;
    }

    getFormControl() {
        return this.formGroup.get(this.question.key);
    }

    getDependControl() {
        if (this.dependQuestion !== null) {
            return this.formGroup.get(this.dependQuestion.key);
        }

        return null;
    }

    getDependSelected(): string | string[] | number  {
        if (this.dependQuestion === null) {
            return null;
        }
        if (this.dependQuestion instanceof QuestionDropDown) {
            if (this.dependQuestion.multiple) {
                let selected = [];
                if (this.getDependControl().value === null) {
                    return [];
                }

                const length = this.dependQuestion.options.length;
                const lastOpt = this.dependQuestion.options[length - 1].key;
                (this.getDependControl().get('normal') as FormArray)
                    .value.map((item, i) => {
                        if (item !== false) {
                            if (i + 1 === length) {
                                // last option
                                if (this.getDependControl().get('other').value.length > 0 && lastOpt === 'other') {
                                    selected.push((this.dependQuestion as QuestionDropDown).options[i].key);
                                }
                            } else {
                                selected.push((this.dependQuestion as QuestionDropDown).options[i].key);
                            }
                        }
                    });

                return selected;
            } else {
                const value = this.getDependControl().get('normal').value;
                if (value === 'other') {
                    return this.getDependControl().get('other').value.length > 0 ?
                        value : null;
                } else {
                    return value;
                }
            }
        } else {
            return this.getDependControl().value;
        }
    }

    satisfyDependency(): boolean {
        if (this.dependQuestion === null) {
            return true;
        }

        const options = this.question.dependencies.requiredOptions;


        let selected = this.getDependSelected();
        if (options === null || options === undefined || typeof selected === 'number' || this.dependQuestion.controlType !== 'dropdown') {
            return this.getDependControl().value !== null;
        }

        if (typeof options === 'string') {
            // apply to the depended question is 'dropdown'
            if (typeof selected === 'string') {
                return selected === options;
            } else {
                return (selected as string[]).includes(options);
            }
        } else {
            return QuestionViewComponent.matchAny(options, selected);
        }
    }

    getSpecifiedOption() {
        return (this.question as QuestionDropDown)
            .options.filter(q => q.key !== 'other');
    }

    getOtherOption() {
        return (this.question as QuestionDropDown)
            .options.find(q => q.key === 'other');
    }

    isOtherChecked(): boolean {
        if (this.question instanceof QuestionDropDown) {
            if (this.question.multiple === false) {
                return this.formGroup.get(this.question.key).get('normal').value === 'other';
            } else {
                const length = this.question.options.length;

                return this.question.options[length - 1].key === 'other' &&
                    this.formGroup.get(this.question.key).get('normal').value[length - 1] !== false;
            }
        }

        return false;
    }

    constructor() { }

    ngOnInit() {
    }



}
