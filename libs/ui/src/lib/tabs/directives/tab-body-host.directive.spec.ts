import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabBodyHostDirective } from './tab-body-host.directive';
import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TabsModule } from '../tabs.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateMockModule } from '@hetznercloud/ngx-translate-mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Mocked component for deep testing of tab directive
 */
@Component({
  standalone: true,
  imports: [TabsModule, TranslateModule],
  template: ` <ui-tabs>
    <ui-tab>
      <ng-container ngProjectAs="label">{{
        'components.queryBuilder.fields.title' | translate
      }}</ng-container>

      <ng-template #tabContent uiTabContent>
        <p>This is some content to display on tab selection</p>
      </ng-template>
    </ui-tab></ui-tabs
  >`,
})
class TestingComponent {
  @ViewChild('tabContent', { read: ViewContainerRef })
  tabContent!: ViewContainerRef;
}
describe('TabBodyHostDirective', () => {
  let fixture: ComponentFixture<TestingComponent>;
  let viewContainerRef!: ViewContainerRef;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingComponent, TranslateMockModule, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);
    viewContainerRef = fixture.componentInstance.tabContent;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new TabBodyHostDirective(
      {} as ComponentFactoryResolver,
      viewContainerRef,
      document
    );
    expect(directive).toBeTruthy();
  });
});
