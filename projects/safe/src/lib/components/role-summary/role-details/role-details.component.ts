import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../../models/user.model';

@Component({
  selector: 'safe-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss'],
})
export class RoleDetailsComponent implements OnInit {
  @Input() role!: Role;
  public form!: FormGroup;
  @Output() edit = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.role.title, Validators.required],
      description: [this.role.description],
    });
  }

  onUpdate(): void {
    this.edit.emit(this.form.value);
  }
}
