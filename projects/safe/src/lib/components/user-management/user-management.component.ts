import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from '../../models/user.model';

// Dummy data
const regions = [
  "Asia",
  "Africa",
  "North America",
  "South America",
  "Europe",
  "Australia"
]
const countries = [
  "Chile"
]
const locationTypes = [
  "Headquarters"
]
const dummyUser = {
  firstName: 'Pedro',
  lastName: 'Pascal',
  email: 'ppascal@mail.com',
  region: 'South America',
  country: 'Chile',
  locationType: 'Headquarters',
  roles: []
}

@Component({
  selector: 'safe-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class SafeUserManagementComponent implements OnInit {

  @Input() public id: string = '';
  @Input() public roles?: Role[];
  public regions = regions;
  public countries = countries;
  public locationTypes = locationTypes;

  public userForm?: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const user = dummyUser;
    this.userForm = this.formBuilder.group({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      region: user.region,
      country: user.country,
      locationType: user.locationType,
      roles: user.roles
    });
  }

  onSubmit(): void {
    console.log(this.userForm?.value);
  }
}
