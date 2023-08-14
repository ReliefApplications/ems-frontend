import { ChipModule } from './chip.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipInputDirective } from './chip-input.directive';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

/**
 * Component for testing purposes
 */
@Component({
  standalone: true,
  template: `<div uiChipList>
    <ui-chip class="!rounded-lg" variant="success">
      {{ 'common.status_active' | translate | titlecase }}
    </ui-chip>
    <ui-chip class="!rounded-lg" variant="warning">
      {{ 'common.status_pending' | translate | titlecase }}
    </ui-chip>
    <ui-chip class="!rounded-lg" variant="danger">
      {{ 'common.status_archived' | translate | titlecase }}
    </ui-chip>
  </div>`,
  imports: [TranslateModule, ChipModule, TitleCasePipe],
})
class TestingComponent {}

describe('ChipInputDirective', () => {
  let fixture!: ComponentFixture<TestingComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TranslateService],
      imports: [
        TestingComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();
    TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(TestingComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.queryAll(
      By.directive(ChipInputDirective)
    );
    expect(directive).not.toBeNull();
    expect(directive).toBeTruthy();
  });
});
