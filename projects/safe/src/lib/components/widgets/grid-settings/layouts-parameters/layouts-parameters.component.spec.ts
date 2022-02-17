import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutsParametersComponent } from './layouts-parameters.component';

describe('LayoutsParametersComponent', () => {
  let component: LayoutsParametersComponent;
  let fixture: ComponentFixture<LayoutsParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutsParametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutsParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
