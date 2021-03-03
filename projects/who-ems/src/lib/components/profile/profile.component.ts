import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { WhoAuthService } from '../../services/auth.service';

@Component({
  selector: 'who-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class WhoProfileComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;
  public user: User;
  public userForm: FormGroup;

  constructor(
    private authService: WhoAuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.user.subscribe((user) => {
      this.user = user;
      this.userForm = this.formBuilder.group(
        {
          name: [{ value: user.name, disabled: true }],
          username: [{value: user.username, disabled: true }]
        }
      );
    });
  }

  onSubmit(): void {}

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
