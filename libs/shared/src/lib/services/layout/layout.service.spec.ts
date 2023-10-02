import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
<<<<<<<< HEAD:libs/ui/src/lib/sidenav/layout/layout.service.spec.ts
import { UILayoutService } from './layout.service';

describe('UILayoutService', () => {
  let service: UILayoutService;
========
import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  let service: LayoutService;
>>>>>>>> beta:libs/shared/src/lib/services/layout/layout.service.spec.ts

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
<<<<<<<< HEAD:libs/ui/src/lib/sidenav/layout/layout.service.spec.ts
    service = TestBed.inject(UILayoutService);
========
    service = TestBed.inject(LayoutService);
>>>>>>>> beta:libs/shared/src/lib/services/layout/layout.service.spec.ts
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
