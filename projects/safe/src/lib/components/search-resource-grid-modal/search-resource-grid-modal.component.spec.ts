import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeResourceGridModalComponent } from './search-resource-grid-modal.component';

describe('ResourceTableModalComponent', () => {
  let component: SafeResourceGridModalComponent;
  let fixture: ComponentFixture<SafeResourceGridModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeResourceGridModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeResourceGridModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
