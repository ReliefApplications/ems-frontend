import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeButtonModule } from './button.module';
import { SafeButtonComponent } from './button.component';
import { ButtonCategory } from './button-category.enum';
import { ButtonSize } from './button-size.enum';

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
    title: 'UI/Button',
    argTypes: {
        category: {
            options: [ButtonCategory.PRIMARY, ButtonCategory.SECONDARY, ButtonCategory.TERTIARY],
            control: { type: 'select' }
        },
        size: {
            options: [ButtonSize.SMALL, ButtonSize.MEDIUM],
            control: { type: 'select' }
        },
        block: {
            defaultValue: false,
            control: { type: 'boolean' }
        },
        disabled: {
            defaultValue: false,
            control: { type: 'boolean' }
        },
        icon: {
            defaultValue: '',
            control: { type: 'text' }
        }
    }
} as Meta;

const Template: Story<SafeButtonComponent> = args => ({
    template: '<safe-button>This is a button</safe-button>',
    props: {
        ...args
    }
});

export const Default = Template.bind({});
Default.args = {
    category: ButtonCategory.PRIMARY,
    size: ButtonSize.MEDIUM
};
