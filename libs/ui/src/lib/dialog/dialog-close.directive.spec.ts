import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DialogModule } from './dialog.module';
import { DialogCloseDirective } from './dialog-close.directive';
import { DialogRef } from '@angular/cdk/dialog';
import { ButtonModule } from '../button/button.module';
import { By } from '@angular/platform-browser';

/**
 * Component for testing purposes
 */
@Component({
  standalone: true,
  template: `<ui-dialog>
    <ng-container ngProjectAs="header">
      <h1>Title</h1>
    </ng-container>
    <ng-container ngProjectAs="content">
      <p>Content</p>
    </ng-container>
    <ng-container ngProjectAs="actions">
      <ui-button
        category="secondary"
        variant="primary"
        [uiDialogClose]="{ value: true }"
      >
        Close
      </ui-button>
    </ng-container>
  </ui-dialog>`,
  imports: [CommonModule, ButtonModule, DialogModule],
})
class TestingComponent {}

describe('DialogCloseDirective', () => {
  let fixture!: ComponentFixture<TestingComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingComponent],
      providers: [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { provide: DialogRef, useValue: { removePanelClass: () => {} } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TestingComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.query(
      By.directive(DialogCloseDirective)
    );
    expect(directive).not.toBeNull();
    expect(directive).toBeTruthy();
  });
});
