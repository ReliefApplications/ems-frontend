import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiConfigurationsComponent } from './api-configurations.component';

describe('ApiConfigurationsComponent', () => {
  let component: ApiConfigurationsComponent;
  let fixture: ComponentFixture<ApiConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiConfigurationsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
