import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@oort-front/shared';

/**
 * Login Page component.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  /**
   * Login Page component.
   *
   * @param authService Shared authentication service
   * @param router Angular router
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Check that user is authenticated, and redirect to main page if true.
   */
  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((res: boolean) => {
      if (res === true) {
        this.router.navigate(['/']);
      }
    });
  }
}
