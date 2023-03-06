import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { SafeWidgetGridComponent } from './widget-grid.component';

describe('SafeWidgetGridComponent', () => {
  let component: SafeWidgetGridComponent;
  let fixture: ComponentFixture<SafeWidgetGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeWidgetGridComponent],
      imports: [MatDialogModule],
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
