import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import { Application } from '../../../models/application.model';
import { Channel } from '../../../models/channel.model';
import { Role } from '../../../models/user.model';
import { GetChannelsQueryResponse, GET_CHANNELS } from '../graphql/queries';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/**
 * Channels tab of Role Summary.
 */
@Component({
  selector: 'safe-role-channels',
  templateUrl: './role-channels.component.html',
  styleUrls: ['./role-channels.component.scss'],
})
export class RoleChannelsComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() role!: Role;
  @Input() application?: Application;

  public channels: Channel[] = [];
  public applications: any[] = [];
  public form!: ReturnType<typeof this.createFormGroup>;
  @Output() edit = new EventEmitter();

  /** Setter for the loading state */
  @Input() set loading(loading: boolean) {
    if (loading) {
      this.form?.disable();
    } else {
      this.form?.enable();
      this.form?.get('email')?.disable();
    }
  }

  /**
   * Channels tab of Role Summary.
   *
   * @param fb Angular form builder
   * @param apollo Apollo client
   */
  constructor(private fb: FormBuilder, private apollo: Apollo) {
    super();
  }

  ngOnInit(): void {
    this.form = this.createFormGroup(this.role);
    this.apollo
      .query<GetChannelsQueryResponse>({
        query: GET_CHANNELS,
        variables: {
          application: this.application?.id,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        this.channels = data.channels;
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
   * Create form group
   *
   * @param role Current role
   * @returns form group
   */
  private createFormGroup(role: Role) {
    return this.fb.group({
      channels: [get(role, 'channels', []).map((x) => x.id)],
    });
  }

  /**
   * Emit new role value
   */
  onUpdate(): void {
    this.edit.emit(this.form.value);
  }
}
