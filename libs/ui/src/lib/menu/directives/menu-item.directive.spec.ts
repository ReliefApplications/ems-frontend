import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuItemDirective } from './menu-item.directive';
import { Component, Renderer2 } from '@angular/core';
import { MenuModule } from '../menu.module';
import { IconModule } from '../../icon/icon.module';
import { TranslateMockModule } from '@hetznercloud/ngx-translate-mock';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Mocked class as Renderer2 to use for directive build
 */
class mockRenderer2 {
  /**
   * addClass
   *
   * @param el element where to apply class
   * @param name class name
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  static addClass(el: any, name: string) {}
}
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
describe('MenuItemDirective', () => {
  let fixture: ComponentFixture<TestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingComponent, TranslateMockModule],
      providers: [{ provide: Renderer2, useClass: mockRenderer2 }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new MenuItemDirective(
      mockRenderer2 as unknown as Renderer2,
      { nativeElement: document.body }
    );
    expect(directive).toBeTruthy();
  });
});
