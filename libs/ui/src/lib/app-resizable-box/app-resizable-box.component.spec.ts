import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppResizableBoxComponent } from './app-resizable-box.component';

describe('AppResizableBoxComponent', () => {
  let component: AppResizableBoxComponent;
  let fixture: ComponentFixture<AppResizableBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppResizableBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppResizableBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
