import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutTableComponent } from './layout-table.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from '@oort-front/ui';

describe('LayoutTableComponent', () => {
  let component: LayoutTableComponent;
  let fixture: ComponentFixture<LayoutTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutTableComponent],
      imports: [
        DialogCdkModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
        ButtonModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
