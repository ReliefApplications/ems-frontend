import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionAttributesComponent } from './position-attributes.component';

describe('PositionComponent', () => {
  let component: PositionAttributesComponent;
  let fixture: ComponentFixture<PositionAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PositionAttributesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
