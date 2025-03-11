import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggersFilterComponent } from './triggers-filter.component';

describe('TriggersFilterComponent', () => {
  let component: TriggersFilterComponent;
  let fixture: ComponentFixture<TriggersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TriggersFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TriggersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
