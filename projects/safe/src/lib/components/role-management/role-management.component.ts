import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

const role = {
  name: 'Wizard',
  description: 'Bibbidi-Bobbidi-Boo',
  canSeeRoles: false,
  canSeeUsers: true,
  users: [
    { name: 'Harry Potter' },
    { name: 'Hermione Granger' },
    { name: 'Ron Weasley' },
    { name: 'Severus Snape' },
    { name: 'Draco Malfoy' },
    { name: 'Lord Voldemort' },
    { name: 'Albus Dumbledore' },
    { name: 'Neville Longbottom' },
    { name: 'Ginny Weasley' },
    { name: 'Luna Lovegood' },
  ],
};

@Component({
  selector: 'safe-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
})
export class SafeRoleManagementComponent implements OnInit {
  public roleForm?: FormGroup;

  public users: string[] = role.users.map((val: any) => val.name);

  @Input() public inApp = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.roleForm = this.formBuilder.group({
      name: new FormControl(role.name, [Validators.required]),
      description: new FormControl(role.description),
      canSeeRoles: new FormControl(role.canSeeRoles),
      canSeeUsers: new FormControl(role.canSeeUsers),
    });
  }

  onSubmit(): void {
    console.log(this.roleForm?.value);
  }
}
