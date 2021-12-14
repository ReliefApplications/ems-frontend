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

const TEMPLATE_WITH_TEXT: Story<SafeBadgeComponent> = args => ({
    template: '<safe-badge [icon]="icon" [size]="size" [variant]="variant">{{content}}</safe-badge>',
    props: {
        ...args,
        content: text('Text', 'This is a badge'),
    }
});

export const DEFAULT = TEMPLATE_WITH_TEXT.bind({});
DEFAULT.args = {
    size: BadgeSize.MEDIUM,
    variant: BadgeVariant.DEFAULT
};

export const ICON = TEMPLATE_WITH_TEXT.bind({});
ICON.args = {
    ...DEFAULT.args,
    icon: 'home'
};
