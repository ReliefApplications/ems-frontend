import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeAvatarModule } from './avatar.module';
import { SafeAvatarComponent } from './avatar.component';
import { AvatarSize } from './avatar-size.enum';
import { withKnobs, text } from '@storybook/addon-knobs';
import { AvatarVariant } from './avatar-variant.enum';

export default {
    component: SafeAvatarComponent,
    decorators: [
        moduleMetadata({
            imports: [
                SafeAvatarModule
            ]
        }),
        withKnobs
    ],
    title: 'UI/Avatar',
    argTypes: {
        size: {
            options: [AvatarSize.SMALL,
                    AvatarSize.MEDIUM],
            control: { type: 'select' }
        },
        variant: {
            options: [AvatarVariant.DEFAULT,
                    AvatarVariant.PRIMARY,
                    AvatarVariant.SUCCESS,
                    AvatarVariant.DANGER,
                    AvatarVariant.WARNING],
            control: { type: 'select' }
        },
        icon: {
            defaultValue: '',
            control: { type: 'text' }
        }
    }
} as Meta;

const TemplateWithText: Story<SafeAvatarComponent> = args => ({
    template: '<safe-avatar [icon]="icon">{{content}}</safe-avatar>',
    props: {
        ...args,
        content: text('Text', 'P'),
    }
});

export const Default = TemplateWithText.bind({});
Default.args = {
    size: AvatarSize.MEDIUM,
    variant: AvatarVariant.DEFAULT
};

export const Icon = TemplateWithText.bind({});
Icon.args = {
    ...Default.args,
    icon: 'home'
}; 