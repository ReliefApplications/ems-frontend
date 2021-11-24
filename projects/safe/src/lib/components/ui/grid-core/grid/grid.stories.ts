import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafeGridComponent } from './grid.component';
import { SafeGridModule } from './grid.module';
import { GridAction } from '../models/grid-action.model';

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
        [error]="error"
        [fields]="fields"
        [data]="data"
        [resizable]="resizable"
        [reorderable]="reorderable"
        [sortable]="sortable"
        [filterable]="filterable"
        [selectable]="selectable"
        [rowActions]="rowActions"
    ></safe-grid></div>`,
    props: {
        ...args
    }
});

const DEFAULT_DATA = [
    {
        id: '1',
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
    },
    {
        id: '2',
        text: 'dummy text 2',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non lacus non magna tempus bibendum vel vitae nisi. Maecenas vel felis sem.',
        boolean: false,
        color: 'blue',
        dropdown: 2,
        radiogroup: 1,
        date: new Date(),
        file: [
            {
                name: 'file'
            }
        ]
    }
];

const DEFAULT_FIELDS = [
    {
        title: 'Text',
        name: 'text',
        type: 'text',
        meta: {
            type: 'text',
            filter: 'text'
        }
    },
    {
        title: 'Comment',
        name: 'comment',
        type: 'comment',
        meta: {
            type: 'text',
            filter: 'text'
        }
    },
    {
        title: 'Boolean',
        name: 'boolean',
        type: 'boolean',
        meta: {
            type: 'boolean',
            filter: 'boolean'
        }
    },
    {
        title: 'Color',
        name: 'color',
        type: 'color',
        meta: {
            type: 'color',
            filter: ''
        }
    },
    {
        title: 'Dropdown',
        name: 'dropdown',
        type: 'dropdown',
        meta: {
            type: 'dropdown',
            filter: 'dropdown',
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
            filter: 'radiogroup',
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
            filter: 'date',
            format: 'dd/MM/yy'
        }
    },
    {
        title: 'File',
        name: 'file',
        type: 'JSON',
        meta: {
            type: 'file',
            filter: ''
        }
    }
];

const DEFAULT_TOOLBAR_ACTIONS: GridAction[] = [
    {
        id: 'delete',
        name: 'Delete'
    },
    {
        id: 'update',
        name: 'Update'
    },
    {
        id: 'convert',
        name: 'Convert'
    }
];

const DEFAULT_ROW_ACTIONS: GridAction[] = [
    {
        id: 'update',
        name: 'Update'
    },
    {
        id: 'history',
        name: 'History'
    },
    {
        id: 'convert',
        name: 'Convert'
    },
    {
        id: 'delete',
        name: 'Delete'
    }
];

export const Default = Template.bind({});
Default.args = {
    fields: DEFAULT_FIELDS,
    data: {
        data: DEFAULT_DATA,
        total: DEFAULT_DATA.length
    },
    toolbarActions: DEFAULT_TOOLBAR_ACTIONS,
    rowActions: DEFAULT_ROW_ACTIONS
};

export const Empty = Template.bind({});
Empty.args = {
    fields: DEFAULT_FIELDS,
    data: {
        data: DEFAULT_DATA,
        total: DEFAULT_DATA.length
    }
};

export const Error = Template.bind({});
Error.args = {
    fields: DEFAULT_FIELDS,
    error: true,
    data: {
        data: [],
        total: 0
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
    reorderable: false,
    sortable: false
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
        },
        matrix: {
            first: 'first',
            second: 'second'
        },
        matrixdropdown: {
            first: {
                first: 'first',
                second: 'second'
            },
            second: {
                first: 'first',
                second: 'second'
            }
        },
        matrixdynamic: [
            {
                first: 'first',
                second: 'second'
            },
            {
                first: 'first',
                second: 'second'
            }
        ]
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
        },
        {
            title: 'Matrix',
            name: 'matrix',
            type: 'JSON',
            meta: {
                type: 'matrix',
                rows: [
                    {
                        label: '1st',
                        name: 'first'
                    },
                    {
                        label: '2nd',
                        name: 'second'
                    }
                ],
                columns: [
                    {
                        label: 'First',
                        name: 'first'
                    },
                    {
                        label: 'Second',
                        name: 'second'
                    },
                    {
                        label: 'Third',
                        name: 'third'
                    }
                ]
            }
        },
        {
            title: 'Matrix Dropdown',
            name: 'matrixdropdown',
            type: 'JSON',
            meta: {
                type: 'matrixdropdown',
                rows: [
                    {
                        label: '1st',
                        name: 'first'
                    },
                    {
                        label: '2nd',
                        name: 'second'
                    }
                ],
                columns: [
                    {
                        label: 'First',
                        name: 'first',
                        type: 'dropdown'
                    },
                    {
                        label: 'Second',
                        name: 'second',
                        type: 'radiogroup'
                    }
                ]
            }
        },
        {
            title: 'Matrix Dynamic',
            name: 'matrixdynamic',
            type: 'JSON',
            meta: {
                type: 'matrixdynamic',
                columns: [
                    {
                        label: 'First',
                        name: 'first',
                        type: 'dropdown'
                    },
                    {
                        label: 'Second',
                        name: 'second',
                        type: 'radiogroup'
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
