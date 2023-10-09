import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIconSelectorComponent } from './view-icon-selector.component';

describe('PageIconComponent', () => {
  let component: ViewIconSelectorComponent;
  let fixture: ComponentFixture<ViewIconSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewIconSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewIconSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
