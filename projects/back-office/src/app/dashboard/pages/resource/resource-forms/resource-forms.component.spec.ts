import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceFormsComponent } from './resource-forms.component';

describe('ResourceFormsComponent', () => {
  let component: ResourceFormsComponent;
  let fixture: ComponentFixture<ResourceFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
