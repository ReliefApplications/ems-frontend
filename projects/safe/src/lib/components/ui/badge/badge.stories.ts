import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeBadgeModule } from './badge.module';
import { SafeBadgeComponent } from './badge.component';
import { BadgeSize } from './badge-size.enum';
import { withKnobs, text } from '@storybook/addon-knobs';
import { BadgeVariant } from './badge-variant.enum';

export default {
    component: SafeBadgeComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeBadgeModule
            ]
        }),
        withKnobs
    ],
    title: 'UI/Badge',
    argTypes: {
        size: {
            options: [BadgeSize.SMALL,
                    BadgeSize.MEDIUM],
            control: { type: 'select' }
        },
        variant: {
            options: [BadgeVariant.DEFAULT,
                    BadgeVariant.PRIMARY,
                    BadgeVariant.SUCCESS,
                    BadgeVariant.DANGER,
                    BadgeVariant.WARNING],
            control: { type: 'select' }
        },
        icon: {
            defaultValue: '',
            control: { type: 'text' }
        }
    }
} as Meta;

const TemplateWithText: Story<SafeBadgeComponent> = args => ({
    template: '<safe-badge [icon]="icon">{{content}}</safe-badge>',
    props: {
        ...args,
        content: text('Text', 'This is a badge'),
    }
});

export const Default = TemplateWithText.bind({});
Default.args = {
    size: BadgeSize.MEDIUM,
    variant: BadgeVariant.DEFAULT
};

export const Icon = TemplateWithText.bind({});
Icon.args = {
    ...Default.args,
    icon: 'home'
};