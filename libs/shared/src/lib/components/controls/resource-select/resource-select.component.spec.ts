import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceSelectComponent } from './resource-select.component';

describe('ResourceSelectComponent', () => {
  let component: ResourceSelectComponent;
  let fixture: ComponentFixture<ResourceSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
