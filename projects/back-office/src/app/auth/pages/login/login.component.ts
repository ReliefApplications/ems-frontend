import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SafeAuthService } from '@safe/builder';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: SafeAuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((res: boolean) => {
      if (res === true) {
        this.router.navigate(['/']);
      }
    });
  }

  /**
   * Redirects to Azure authentication page.
   */
  onLogin(): void {
  }
}
