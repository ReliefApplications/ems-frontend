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
    template: `<div style="height: 400px"><safe-grid
        [loading]="loading"
        [fields]="fields"
        [data]="data"
        [resizable]="resizable"
        [reorderable]="reorderable"
    ></safe-grid></div>`,
    props: {
        ...args
    }
});

const DEFAULT_DATA = [
    {
        text: 'dummy text',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non lacus non magna tempus bibendum vel vitae nisi. Maecenas vel felis sem.',
        boolean: true,
        color: 'red',
        dropdown: 1,
        radiogroup: 2,
        date: new Date(),
        file: [
            {
                name: 'file'
            }
        ]
    }
];

export const Default = Template.bind({});
Default.args = {
    fields: [
        {
            title: 'Text',
            name: 'text',
            type: 'text',
            meta: {
                type: 'text'
            }
        },
        {
            title: 'Comment',
            name: 'comment',
            type: 'comment',
            meta: {
                type: 'text'
            }
        },
        {
            title: 'Boolean',
            name: 'boolean',
            type: 'boolean',
            meta: {
                type: 'boolean'
            }
        },
        {
            title: 'Color',
            name: 'color',
            type: 'color',
            meta: {
                type: 'color'
            }
        },
        {
            title: 'Dropdown',
            name: 'dropdown',
            type: 'dropdown',
            meta: {
                type: 'dropdown',
                choices: [
                    {
                        value: 1,
                        text: 'Option 1'
                    },
                    {
                        value: 2,
                        text: 'Option 2'
                    }
                ]
            }
        },
        {
            title: 'Radiogroup',
            name: 'radiogroup',
            type: 'radiogroup',
            meta: {
                type: 'radiogroup',
                choices: [
                    {
                        value: 1,
                        text: 'Option 1'
                    },
                    {
                        value: 2,
                        text: 'Option 2'
                    }
                ]
            }
        },
        {
            title: 'Date',
            name: 'date',
            type: 'date',
            meta: {
                type: 'date',
                format: 'dd/MM/yy'
            }
        },
        {
            title: 'File',
            name: 'file',
            type: 'JSON',
            meta: {
                type: 'file'
            }
        }
    ],
    data: {
        data: DEFAULT_DATA,
        total: DEFAULT_DATA.length
    }
};

export const Loading = Template.bind({});
Loading.args = {
    ...Default.args,
    loading: true
};

export const Fixed = Template.bind({});
Fixed.args = {
    ...Default.args,
    resizable: false,
    reorderable: false
};

const MULTI_SELECT_DATA = [
    {
        checkbox: [1, 2],
        tagbox: [1, 2],
        users: [1, 2]
    }
];

export const MultiSelectInputs = Template.bind({});
MultiSelectInputs.args = {
    fields: [
        {
            title: 'Checkbox',
            name: 'checkbox',
            type: 'JSON',
            meta: {
                type: 'checkbox',
                choices: [
                    {
                        value: 1,
                        text: 'Option 1'
                    },
                    {
                        value: 2,
                        text: 'Option 2'
                    }
                ]
            }
        },
        {
            title: 'Tagbox',
            name: 'tagbox',
            type: 'JSON',
            meta: {
                type: 'tagbox',
                choices: [
                    {
                        value: 1,
                        text: 'Option 1'
                    },
                    {
                        value: 2,
                        text: 'Option 2'
                    }
                ]
            }
        },
        {
            title: 'Users',
            name: 'users',
            type: 'JSON',
            meta: {
                type: 'users',
                choices: [
                    {
                        value: 1,
                        text: 'User 1'
                    },
                    {
                        value: 2,
                        text: 'User 2'
                    }
                ]
            }
        }
    ],
    data: {
        data: MULTI_SELECT_DATA,
        total: MULTI_SELECT_DATA.length
    }
};

const COMPLEX_DATA = [
    {
        multipletext: {
            first: 'first text',
            second: 'second text'
        }
    }
];

export const ComplexInputs = Template.bind({});
ComplexInputs.args = {
    fields: [
        {
            title: 'Multiple text',
            name: 'multipletext',
            type: 'JSON',
            meta: {
                type: 'multipletext',
                columns: [
                    {
                        label: 'First',
                        name: 'first'
                    },
                    {
                        label: 'Second',
                        name: 'second'
                    }
                ]
            }
        }
    ],
    data: {
        data: COMPLEX_DATA,
        total: COMPLEX_DATA.length
    }
};
