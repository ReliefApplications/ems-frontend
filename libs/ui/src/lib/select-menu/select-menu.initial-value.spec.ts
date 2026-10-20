import { Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectMenuModule } from './select-menu.module';
import { SelectMenuComponent } from './select-menu.component';

/** Host using options declared directly in the template ( no ngFor ) */
@Component({
  template: `
    <ui-select-menu [formControl]="control">
      <ui-select-option value="error">Block (prevent saving)</ui-select-option>
      <ui-select-option value="warning">
        Warn (let the user save anyway)
      </ui-select-option>
    </ui-select-menu>
  `,
})
class StaticOptionsHostComponent {
  /** Control with an initial value */
  control = new FormControl('warning');
}

/** Host using options rendered with ngFor */
@Component({
  template: `
    <ui-select-menu [formControl]="control">
      <ui-select-option *ngFor="let option of options" [value]="option.value">
        {{ option.label }}
      </ui-select-option>
    </ui-select-menu>
  `,
})
class NgForOptionsHostComponent {
  /** Control with an initial value */
  control = new FormControl('warning');
  /** Options of the select */
  options = [
    { value: 'error', label: 'Block (prevent saving)' },
    { value: 'warning', label: 'Warn (let the user save anyway)' },
  ];
}

/** Host whose options are loaded some time after the value is set */
@Component({
  template: `
    <ui-select-menu [formControl]="control">
      <ui-select-option *ngFor="let option of options" [value]="option.value">
        {{ option.label }}
      </ui-select-option>
    </ui-select-menu>
  `,
})
class DelayedOptionsHostComponent {
  /** Control with an initial value */
  control = new FormControl('warning');
  /** Options of the select, empty until loaded */
  options: { value: string; label: string }[] = [];

  /** Loads the options one minute after the component is created */
  constructor() {
    // Simulates choices loaded from an external source, one minute later
    setTimeout(() => {
      this.options = [
        { value: 'error', label: 'Block (prevent saving)' },
        { value: 'warning', label: 'Warn (let the user save anyway)' },
      ];
    }, 60000);
  }
}

describe('SelectMenuComponent initial value display', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StaticOptionsHostComponent,
        NgForOptionsHostComponent,
        DelayedOptionsHostComponent,
      ],
      imports: [
        ReactiveFormsModule,
        SelectMenuModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  const getSelect = (fixture: ComponentFixture<any>): SelectMenuComponent =>
    fixture.debugElement.children[0].componentInstance;

  it('displays the label of the initial value with static options', () => {
    const fixture = TestBed.createComponent(StaticOptionsHostComponent);
    fixture.detectChanges();
    const select = getSelect(fixture);
    expect(select.displayTrigger).toEqual('Warn (let the user save anyway)');
    expect(
      fixture.nativeElement.querySelector('button span').textContent.trim()
    ).toEqual('Warn (let the user save anyway)');
  });

  it('displays the label of the initial value with ngFor options', () => {
    const fixture = TestBed.createComponent(NgForOptionsHostComponent);
    // Options rendered with ngFor are checked before the select menu marks
    // them as selected ( pre-existing NG0100 in dev mode, not covered here )
    fixture.detectChanges(false);
    const select = getSelect(fixture);
    expect(select.displayTrigger).toEqual('Warn (let the user save anyway)');
  });

  it('displays the label of the initial value once delayed options are loaded', fakeAsync(() => {
    const fixture = TestBed.createComponent(DelayedOptionsHostComponent);
    fixture.detectChanges();
    const select = getSelect(fixture);
    // Nothing to display while the options are not loaded
    expect(select.displayTrigger).toEqual('');

    tick(60000);
    fixture.detectChanges(false);
    expect(select.displayTrigger).toEqual('Warn (let the user save anyway)');
    expect(
      fixture.nativeElement.querySelector('button span').textContent.trim()
    ).toEqual('Warn (let the user save anyway)');
  }));
});
