import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomStyleComponent } from './custom-style.component';

describe('CustomStyleComponent', () => {
  let component: CustomStyleComponent;
  let fixture: ComponentFixture<CustomStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomStyleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
