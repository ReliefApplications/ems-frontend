import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeEditAccessComponent } from './edit-access.component';

describe('SafeEditAccessComponent', () => {
  let component: SafeEditAccessComponent;
  let fixture: ComponentFixture<SafeEditAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeEditAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEditAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
