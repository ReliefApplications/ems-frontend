import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueValueRendererComponent } from './unique-value-renderer.component';

describe('UniqueValueRendererComponent', () => {
  let component: UniqueValueRendererComponent;
  let fixture: ComponentFixture<UniqueValueRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniqueValueRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UniqueValueRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
