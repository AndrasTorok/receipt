import { FormControl, FormGroup, Validators } from '@angular/forms';

export class CycleDetailFormControl extends FormControl {
    label: string;
    modelProperty: string;

    constructor(label: string, property: string, value: any, validator: any) {
        super(value, validator);
        this.label = label;
        this.modelProperty= property;
    }
}

export class CycleDetailFormGroup extends FormGroup {

    constructor() {
        super({
            name: new CycleDetailFormControl("", "", "", Validators.required)
        });
    }
}