import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';

import { WidgetGridComponent } from './widget-grid.component';

describe('WidgetGridComponent', () => {
  let component: WidgetGridComponent;
  let fixture: ComponentFixture<WidgetGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetGridComponent],
      imports: [DialogCdkModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
