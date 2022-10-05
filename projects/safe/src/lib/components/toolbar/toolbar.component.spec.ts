import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: SafeToolbarComponent;
  let fixture: ComponentFixture<SafeToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
