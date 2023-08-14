import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MenuModule } from '../menu.module';
import { IconModule } from '../../icon/icon.module';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Mocked component for deep testing of menu directive
 */
@Component({
  standalone: true,
  imports: [MenuModule, IconModule, TranslateModule],
  template: ` <ui-menu #menu>
    <button uiMenuItem>
      <ui-icon icon="edit" variant="grey"></ui-icon>
      {{ 'common.edit' | translate }}
    </button>
    <button uiMenuItem>
      <ui-icon icon="delete" variant="danger"></ui-icon>
      {{ 'common.delete' | translate }}
    </button>
  </ui-menu>`,
})
class TestingComponent {}
describe('MenuTriggerForDirective', () => {
  let fixture: ComponentFixture<TestingComponent>;
  let component: TestingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingComponent,
        TranslateTestingModule.withTranslations('en', {
          common: { edit: 'Edit', delete: 'Delete' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).not.toBeNull();
    expect(component).toBeTruthy();
  });
});
