import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeButtonModule } from './button.module';
import { SafeButtonComponent } from './button.component';
import { ButtonCategory } from './button-category.enum';
import { ButtonSize } from './button-size.enum';
import { ButtonVariant } from './button-variant.enum';
import { withKnobs, text } from '@storybook/addon-knobs';

export default {
    component: SafeButtonComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeButtonModule
            ],
            providers: []
        }),
        withKnobs
    ],
    title: 'UI/Button',
    argTypes: {
        size: {
            options: [ButtonSize.SMALL, ButtonSize.MEDIUM],
            control: { type: 'select' }
        },
        category: {
            options: [ButtonCategory.PRIMARY, ButtonCategory.SECONDARY, ButtonCategory.TERTIARY],
            control: { type: 'select' }
        },
        variant: {
            options: [
                ButtonVariant.DEFAULT,
                ButtonVariant.PRIMARY,
                ButtonVariant.SUCCESS,
                ButtonVariant.DANGER
            ],
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
        loading: {
            defaultValue: false,
            control: { type: 'boolean' }
        },
        icon: {
            defaultValue: '',
            control: { type: 'text' }
        },
        isIcon: {
            defaultValue: false,
            control: { type: 'boolean' }
        }
    }
} as Meta;

const TemplateWithText: Story<SafeButtonComponent> = args => ({
    template: '<safe-button [icon]="icon">{{content}}</safe-button>',
    props: {
        ...args,
        content: text('Text', 'This is a button')
    }
});

const TemplateWithoutText: Story<SafeButtonComponent> = args => ({
    props: {
        ...args
    }
});

export const Default = TemplateWithText.bind({});
Default.args = {
    category: ButtonCategory.PRIMARY,
    size: ButtonSize.MEDIUM,
    variant: ButtonVariant.DEFAULT
};

export const IconAndText = TemplateWithText.bind({});
IconAndText.args = {
    ...Default.args,
    icon: 'home'
};

export const Icon = TemplateWithoutText.bind({});
Icon.args = {
    ...Default.args,
    isIcon: true,
    icon: 'home'
}
