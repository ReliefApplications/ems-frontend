import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebFormComponent } from './web-form.component';

describe('WebFormComponent', () => {
  let component: WebFormComponent;
  let fixture: ComponentFixture<WebFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
