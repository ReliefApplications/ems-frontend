import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeButtonModule } from './button.module';
import { SafeButtonComponent } from './button.component';
import { MatButtonModule } from '@angular/material/button';

export default {
    component: SafeButtonComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeButtonModule
            ],
            providers: []
        })
    ],
    title: 'UI/Button'
} as Meta;

const Template: Story<SafeButtonComponent> = args => ({
    template: '<button safe-button mat-button>Default</button>',
    props: {
        ...args
    }
});

export const Default = Template.bind({});
Default.args = {
    color: 'primary',
    isRoundButton: true
};
