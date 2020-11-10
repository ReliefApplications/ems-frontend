import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoFormBuilderComponent } from './form-builder.component';

describe('WhoFormBuilderComponent', () => {
  let component: WhoFormBuilderComponent;
  let fixture: ComponentFixture<WhoFormBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoFormBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
