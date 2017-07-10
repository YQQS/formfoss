import {AbstractControl} from '@angular/forms';
export class FossValidators {
    static passwordMatchValidator(g: AbstractControl) {
        return g.get('userPassword').value === g.get('userPasswordRepeat').value
            ? null : {
                mismatch: {
                    valid: false
                }
            };
    }
}
