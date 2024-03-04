import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UnsubscribeComponent } from '@oort-front/shared';
import { takeUntil } from 'rxjs';

/**
 * Login Page component.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends UnsubscribeComponent implements OnInit {
  /**
   * Login Page component.
   *
   * @param authService Shared authentication service
   * @param router Angular router
   */
  constructor(private authService: AuthService, private router: Router) {
    super();
  }

  /**
   * Check that user is authenticated, and redirect to main page if true.
   */
  ngOnInit(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          this.router.navigate(['/']);
        }
      });
  }
}
