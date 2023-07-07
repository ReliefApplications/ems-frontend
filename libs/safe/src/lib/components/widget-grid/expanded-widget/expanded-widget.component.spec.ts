import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';

import { SafeExpandedWidgetComponent } from './expanded-widget.component';

describe('SafeExpandedWidgetComponent', () => {
  let component: SafeExpandedWidgetComponent;
  let fixture: ComponentFixture<SafeExpandedWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: {} },
        {
          provide: DIALOG_DATA,
          useValue: {
            access: { canSee: null, canUpdate: null, canDelete: null },
          },
        },
      ],
      declarations: [SafeExpandedWidgetComponent],
      imports: [DialogCdkModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeExpandedWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
