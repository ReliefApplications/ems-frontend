import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafeGridComponent } from './grid.component';
import { SafeGridModule } from './grid.module';

export default {
    component: SafeGridComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeGridModule,
                BrowserAnimationsModule
            ],
            providers: []
        }),
        withKnobs
    ],
    title: 'UI/Grid',
    argTypes: {}
} as Meta;

const Template: Story<SafeGridComponent> = args => ({
    props: {
        ...args
    }
});

export const Default = Template.bind({});
Default.args = {

};
