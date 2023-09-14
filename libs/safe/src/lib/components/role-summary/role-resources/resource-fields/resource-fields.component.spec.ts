import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceFieldsComponent } from './resource-fields.component';
import { TranslateModule } from '@ngx-translate/core';
import { SelectMenuModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ResourceFieldsComponent', () => {
  let component: ResourceFieldsComponent;
  let fixture: ComponentFixture<ResourceFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceFieldsComponent],
      imports: [
        TranslateModule.forRoot(),
        SelectMenuModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceFieldsComponent);
    component = fixture.componentInstance;
    component.resource = { fields: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
