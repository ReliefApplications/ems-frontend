import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabBodyHostDirective } from './tab-body-host.directive';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { TabsModule } from '../tabs.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

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
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingComponent,
        TranslateTestingModule.withTranslations('en', {
          components: { queryBuilder: { fields: { title: 'Fields' } } },
        }),
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);
    // viewContainerRef = fixture.componentInstance.tabContent;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.queryAll(
      By.directive(TabBodyHostDirective)
    );
    expect(directive).not.toBeNull();
    expect(directive).toBeTruthy();
  });
});
