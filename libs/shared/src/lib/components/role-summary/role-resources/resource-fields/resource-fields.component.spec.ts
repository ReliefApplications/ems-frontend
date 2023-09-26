import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFieldsComponent } from './resource-fields.component';

describe('ResourceFieldsComponent', () => {
  let component: ResourceFieldsComponent;
  let fixture: ComponentFixture<ResourceFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceFieldsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
