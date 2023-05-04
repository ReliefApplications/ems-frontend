import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { SidenavContainerComponent } from './sidenav-container.component';
import { SidenavContainerModule } from './sidenav-container.module';
import { ButtonModule } from '../button/button.module';

export default {
  title: 'Sidenav',
  component: SidenavContainerComponent,
  argTypes: {
    showSidenav: {
      control: 'boolean',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [SidenavContainerModule, ButtonModule],
    }),
  ],
} as Meta<SidenavContainerComponent>;

/**
 * Primary sidenav template
 *
 * @param {SidenavContainerComponent} args args
 * @returns SidenavContainerComponent
 */
const SidenavTemplate: StoryFn<SidenavContainerComponent> = (
  args: SidenavContainerComponent
) => {
  args.showSidenav = true;
  return {
    component: SidenavContainerComponent,
    template: `
      <ui-sidenav-container>
        <ng-container ngProjectAs="content">
        <ui-button (click)="nav.toggle()">Toggle sidenav</ui-button>
          <p class="mt-3">Main content</p>
        </ng-container>
        <ng-container
          uiSidenavDirective
          #nav="uiSidenavDirective"
          [(opened)]="showSidenav"
          ngProjectAs="sidenavContent"
        >
          <div *ngFor="let i of [].constructor(25)">Sidenav Content</div>
        </ng-container>
      </ui-sidenav-container>
    `,
    props: {
      ...args,
    },
  };
};

/** Sidenav sidenav */
export const Sidenav = SidenavTemplate.bind({});
