import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleRendererComponent } from './simple-renderer.component';

describe('SimpleRendererComponent', () => {
  let component: SimpleRendererComponent;
  let fixture: ComponentFixture<SimpleRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
