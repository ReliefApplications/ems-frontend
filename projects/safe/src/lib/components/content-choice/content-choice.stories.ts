import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { SafeContentChoiceComponent } from './content-choice.component';
import { SafeContentChoiceModule } from './content-choice.module';
import { CONTENT_TYPES } from '../../models/page.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

export default {
    component: SafeContentChoiceComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeContentChoiceModule,
                FormsModule,
                ReactiveFormsModule
            ],
            providers: []
        }),
        withKnobs
    ],
    title: 'UI/Content Type Choice'
} as Meta;

const TEMPLATE: Story<SafeContentChoiceComponent> = args => ({
    template: '<safe-content-choice [formControl]="type" [contentTypes]="contentTypes"></safe-content-choice>',
    props: {
        ...args,
        type: new FormControl('')
    }
});

export const DEFAULT  = TEMPLATE.bind({});
DEFAULT.args = {
    contentTypes: CONTENT_TYPES
};
