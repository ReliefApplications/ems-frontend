import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceSelectTextComponent } from './resource-select-text.component';

describe('ResourceSelectTextComponent', () => {
  let component: ResourceSelectTextComponent;
  let fixture: ComponentFixture<ResourceSelectTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceSelectTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceSelectTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
