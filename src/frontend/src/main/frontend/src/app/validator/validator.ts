import {AbstractControl, FormGroup} from "@angular/forms";
export class FossValidators {
    static passwordMatchValidator(g: FormGroup) {
        return g.get('userPassword').value === g.get('userPasswordRepeat').value
            ? null : {
                mismatch: {
                    valid: false
                }
            };
    }
}