import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class Chart {

    public form: FormGroup;
    private fb: FormBuilder;

    constructor(settings?: any) {
        this.fb = new FormBuilder();
        const legend = settings ? settings.legend : null;
        const title = settings ? settings.title : null;
        const pipeline = settings ? settings.pipeline : null;
        this.form = this.fb.group({
            type: [(settings && settings.type) ? settings.type : null, Validators.required],
            pipeline: [pipeline, Validators.required],
            legend: this.fb.group({
                visible: [legend ? legend.visible : true],
                position: [legend ? legend.position : 'bottom'],
                orientation: [legend ? legend.orientation : 'horizontal']
            }),
            title: this.fb.group({
                visible: [title ? title.visible : true],
                text: [title ? title.text : null],
                position: [title ? title.position : 'top']
            })
        });
    }
}
