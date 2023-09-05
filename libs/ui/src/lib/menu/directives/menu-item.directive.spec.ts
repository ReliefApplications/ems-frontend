import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuItemDirective } from './menu-item.directive';
import { Component } from '@angular/core';
import { MenuModule } from '../menu.module';
import { IconModule } from '../../icon/icon.module';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

/**
 * Mocked component for deep testing of menu directive
 */
@Component({
  standalone: true,
  imports: [MenuModule, IconModule, TranslateModule],
  template: ` <button uiMenuItem>
    <ui-icon icon="edit" variant="grey"></ui-icon>
    {{ 'common.edit' | translate }}
  </button>`,
})
class TestingComponent {}
describe('MenuItemDirective', () => {
  let fixture: ComponentFixture<TestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingComponent,
        TranslateTestingModule.withTranslations('en', {
          common: { edit: 'Edit' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.queryAll(
      By.directive(MenuItemDirective)
    );
    expect(directive).not.toBeNull();
    expect(directive).toBeTruthy();
  });
});
