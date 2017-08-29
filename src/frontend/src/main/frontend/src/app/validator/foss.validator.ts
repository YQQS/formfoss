import {AbstractControl, FormArray} from '@angular/forms';

export class FossValidators {
    static passwordMatchValidator(g: AbstractControl) {
        return g.get('userPassword').value === g.get('userPasswordRepeat').value
            ? null : {
                mismatch: {
                    valid: false
                }
            };
    }

    // form edit validators
    static noLargerValidator(g: AbstractControl) {
        return g.get('minSelect-edit').value > g.get('maxSelect-edit').value ?
            {
                noLarger: {
                    valid: false
                }
            } : null;
    }

    static editMaxSelect(g: AbstractControl) {
        return g.get('maxSelect-edit').value > Object.keys(g.get('options-edit').value).length ?
            {
                editMaxSelect: {
                    valid: false
                }
            } : null;
    }

    // form fill in validators
    static minSelect(min: number) {
        return (g: FormArray) =>
            (g.value as any[]).filter(item => item !== false).length < min ?
             {
                minSelect: {
                    valid: false
                }
             } : null;
    }


    static maxSelect(max: number) {
        return (g: FormArray) =>
            (g.value as any[]).filter(item => item !== false).length > max ?
             {
                maxSelect: {
                    valid: false
                }
             } : null;
    }

}
