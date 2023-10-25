import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';

import { SafeWidgetGridComponent } from './widget-grid.component';

describe('SafeWidgetGridComponent', () => {
  let component: SafeWidgetGridComponent;
  let fixture: ComponentFixture<SafeWidgetGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeWidgetGridComponent],
      imports: [DialogCdkModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeWidgetGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
