import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import { Channel } from '../../../models/channel.model';
import { Role } from '../../../models/user.model';
import { GetChannelsQueryResponse, GET_CHANNELS } from '../graphql/queries';

/**
 * Channels tab of Role Summary.
 */
@Component({
  selector: 'safe-role-channels',
  templateUrl: './role-channels.component.html',
  styleUrls: ['./role-channels.component.scss'],
})
export class RoleChannelsComponent implements OnInit {
  @Input() role!: Role;
  public channels: Channel[] = [];
  public applications: any[] = [];
  public form!: FormGroup;
  @Output() edit = new EventEmitter();

  /**
   * Channels tab of Role Summary.
   *
   * @param fb Angular form builder
   * @param apollo Apollo client
   */
  constructor(private fb: FormBuilder, private apollo: Apollo) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      channels: [get(this.role, 'channels', []).map((x) => x.id)],
    });
    this.apollo
      .watchQuery<GetChannelsQueryResponse>({
        query: GET_CHANNELS,
        variables: {
          application: this.role.application?.id,
        },
      })
      .valueChanges.subscribe((res) => {
        this.channels = res.data.channels;
        // Move channels in an array under corresponding applications.
        this.applications = Array.from(
          new Set(this.channels.map((x) => x.application?.name))
        ).map((name) => ({
          name: name ? name : 'Global',
          channels: this.channels.reduce((o: Channel[], channel: Channel) => {
            if (channel?.application?.name === name) {
              o.push(channel);
            }
            return o;
          }, []),
        }));
      });
  }

  /**
   * Emit new role value
   */
  onUpdate(): void {
    this.edit.emit(this.form.value);
  }
}
