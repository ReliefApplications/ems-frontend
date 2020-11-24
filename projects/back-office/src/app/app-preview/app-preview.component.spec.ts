import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPreviewComponent } from './app-preview.component';

describe('AppPreviewComponent', () => {
  let component: AppPreviewComponent;
  let fixture: ComponentFixture<AppPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
