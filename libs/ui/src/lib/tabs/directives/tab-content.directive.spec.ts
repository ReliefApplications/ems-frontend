import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabContentDirective } from './tab-content.directive';
import { TranslateModule } from '@ngx-translate/core';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TranslateMockModule } from '@hetznercloud/ngx-translate-mock';
import { TabsModule } from '../tabs.module';
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
  @ViewChild('tabContent', { read: TemplateRef }) tabContent!: TemplateRef<any>;
}
describe('TabContentDirective', () => {
  let fixture: ComponentFixture<TestingComponent>;
  let templateRef!: TemplateRef<any>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingComponent, TranslateMockModule, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);
    templateRef = fixture.componentInstance.tabContent;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new TabContentDirective(templateRef);
    expect(directive).toBeTruthy();
  });
});
