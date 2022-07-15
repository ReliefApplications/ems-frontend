import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsTabComponent } from './forms-tab.component';

describe('FormsTabComponent', () => {
  let component: FormsTabComponent;
  let fixture: ComponentFixture<FormsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
