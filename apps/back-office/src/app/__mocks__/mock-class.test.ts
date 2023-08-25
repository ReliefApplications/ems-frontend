import { Component } from '@angular/core';
import { SnackBarConfig } from '@oort-front/ui';
import { of } from 'rxjs';

@Component({})
export class TestingComponent {}

export class MockedSafeAuthService {
  account: any;
  getProfile() {
    return of({ data: { me: null } });
  }
  logout() {}
}

export class MockedSnackbarService {
  openSnackBar(message: string, config: SnackBarConfig) {
    console.log(message);
  }
}

export class MockedTranslateService {
  instant(key: string) {}
}

export class MockedRouter {
  navigate(route: string[]) {}
}
