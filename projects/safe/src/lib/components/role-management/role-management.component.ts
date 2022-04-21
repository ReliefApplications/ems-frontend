import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Channel } from '../../models/channel.model';
import { GetChannelsQueryResponse, GET_CHANNELS } from '../../graphql/queries';
import { I } from '@angular/cdk/keycodes';

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
  features: [],
  channels: [],
};

const mockFeatures = [
  {
    title: 'Board 1',
    type: 'dashboard',
    id: 1,
  },
  {
    title: 'Board 2',
    type: 'dashboard',
    id: 2,
  },
  {
    title: 'Workflow 1',
    type: 'workflow',
    id: 3,
  },
  {
    title: 'Workflow 2',
    type: 'workflow',
    id: 4,
  },
  {
    title: 'Form 1',
    type: 'form',
    id: 5,
  },
  {
    title: 'Form 2',
    type: 'form',
    id: 6,
  },
];

@Component({
  selector: 'safe-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
})
export class SafeRoleManagementComponent implements OnInit {
  // Page status
  @Input() public inApp = false;

  // Final form to be updated
  public roleForm?: FormGroup;

  // Summary tab
  public users: string[] = role.users.map((val: any) => val.name);

  // Channels tab
  public channels: Channel[] = [];
  public applications: any[] = [];
  public selectedChannels: any[] = role.channels;
  public channelSearch = '';

  // Features tab
  public features: any[] = [];
  public selectedFeatures: any[] = role.features;
  public featureSearch = '';

  constructor(private formBuilder: FormBuilder, private apollo: Apollo) {}

  ngOnInit(): void {
    this.apollo
      .watchQuery<GetChannelsQueryResponse>({
        query: GET_CHANNELS,
      })
      .valueChanges.subscribe((res) => {
        this.channels = res.data.channels;
        this.updateApplicationsChannels();
      });

    this.updateFeatures();

    this.roleForm = this.formBuilder.group({
      name: [role.name, Validators.required],
      features: [role.features],
      channels: [role.channels],
      description: new FormControl(role.description),
      canSeeRoles: new FormControl(role.canSeeRoles),
      canSeeUsers: new FormControl(role.canSeeUsers),
    });
  }

  /**
   * Moves features in an array under corresponding groups
   */
  private updateFeatures() {
    this.features = [];

    mockFeatures.map((feature: any) => {
      let i: number = this.features.findIndex(
        (element) => element.type === feature.type
      );
      if (i < 0) {
        this.features.push({
          type: feature.type,
          icon: this.getFeatureIcon(feature.type),
          contents: [],
        });
        i = this.features.length - 1;
      }
      if (
        feature.title.toLowerCase().includes(this.featureSearch.toLowerCase())
      ) {
        this.features[i].contents.push(feature);
      }
    });
  }

  /** Gets type icon */
  private getFeatureIcon(type: string): string {
    switch (type) {
      case 'dashboard':
        return 'dashboard';
      case 'workflow':
        return 'linear_scale';
      case 'form':
        return 'description';
      default:
        return '';
    }
  }

  /**
   * Adds or removes a feature from the list of selected features
   */
  public onFeatureClick(id: string) {
    if (this.selectedFeatures.includes(id)) {
      this.selectedFeatures = this.selectedFeatures.filter(
        (item) => item !== id
      );
    } else {
      this.selectedFeatures.push(id);
    }
  }

  /**
   * Updates the feature list depending on the searchterm
   */
  public onFeatureSearch() {
    this.updateFeatures();
  }

  /**
   * Moves channels in an array under corresponding applications
   */
  private updateApplicationsChannels() {
    this.applications = Array.from(
      new Set(this.channels.map((x: any) => x.application?.name))
    ).map((name) => ({
      name: name ? name : 'Global',
      channels: this.channels.reduce((o: Channel[], channel: Channel) => {
        if (
          channel?.application?.name === name &&
          channel?.title
            ?.toLowerCase()
            .includes(this.channelSearch.toLowerCase())
        ) {
          o.push(channel);
        }
        return o;
      }, []),
    }));
  }

  /**
   * Adds or removes a channel from the list of selected channels
   */
  public onChannelClick(id: string) {
    if (this.selectedChannels.includes(id)) {
      this.selectedChannels = this.selectedChannels.filter(
        (item) => item !== id
      );
    } else {
      this.selectedChannels.push(id);
    }
  }

  /**
   * Updates the channel list depending on the searchterm
   */
  public onChannelSearch() {
    this.updateApplicationsChannels();
  }

  /**
   * Adds selected features and channels, then it updates the role
   */
  public onSubmit(): void {
    this.roleForm?.patchValue({
      features: this.selectedFeatures,
      channels: this.selectedChannels,
    });
    console.log(this.roleForm?.value);
  }
}
