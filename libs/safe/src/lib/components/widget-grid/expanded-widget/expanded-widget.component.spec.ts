import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { SafeExpandedWidgetComponent } from './expanded-widget.component';
import { DialogModule } from '@oort-front/ui';
import { SafeWidgetModule } from '../../widget/widget.module';
import { TranslateModule } from '@ngx-translate/core';

describe('SafeExpandedWidgetComponent', () => {
  let component: SafeExpandedWidgetComponent;
  let fixture: ComponentFixture<SafeExpandedWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: { addPanelClass: jest.fn() } },
        {
          provide: DIALOG_DATA,
          useValue: {
            access: { canSee: null, canUpdate: null, canDelete: null },
            widget: {},
          },
        },
      ],
      declarations: [SafeExpandedWidgetComponent],
      imports: [DialogModule, SafeWidgetModule, TranslateModule.forRoot()],
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
