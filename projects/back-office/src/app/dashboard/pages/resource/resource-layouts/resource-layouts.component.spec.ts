import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceLayoutsComponent } from './resource-layouts.component';

describe('ResourceLayoutsComponent', () => {
  let component: ResourceLayoutsComponent;
  let fixture: ComponentFixture<ResourceLayoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceLayoutsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceLayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
