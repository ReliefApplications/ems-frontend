import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { SafeWidgetChoiceComponent } from './widget-choice.component';
import { SafeWidgetChoiceModule } from './widget-choice.module';
import { IWidgetType, WIDGET_TYPES } from '../../models/dashboard.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
    component: SafeWidgetChoiceComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeWidgetChoiceModule,
                BrowserAnimationsModule
            ],
            providers: []
        }),
        withKnobs
    ],
    title: 'UI/Dashboard/Widget Choice',
    argsTypes: {
        floating: {
            defaultValue: false,
            control: { type: 'boolean' }
        }
    }
} as Meta;

const Template: Story<SafeWidgetChoiceComponent> = args => ({
    template: '<safe-widget-choice></safe-widget-choice>',
    props: {
        ...args
    }
});

export const Default = Template.bind({});
Default.args = {
    floating: false,
    widgetTypes: WIDGET_TYPES as IWidgetType[]
};
