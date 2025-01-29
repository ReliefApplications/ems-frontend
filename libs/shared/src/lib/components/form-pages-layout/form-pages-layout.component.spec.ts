import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPagesLayoutComponent } from './form-pages-layout.component';

describe('FormPagesLayoutComponent', () => {
  let component: FormPagesLayoutComponent;
  let fixture: ComponentFixture<FormPagesLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormPagesLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormPagesLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
