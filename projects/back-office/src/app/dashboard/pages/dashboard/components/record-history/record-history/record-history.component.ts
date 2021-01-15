import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-record-history',
  templateUrl: './record-history.component.html',
  styleUrls: ['./record-history.component.css']
})
export class RecordHistoryComponent implements OnInit {

    @Input() data;
    // versions = [];
    versions = [];
    loading = true;
    displayedColumns: string[] = ['position'];

//   constructor(
//       public dialogRef: MatDialogRef<RecordHistoryComponent>,
//       @Inject(MAT_DIALOG_DATA) public data: any) {
//         this.transformVersion(data).then( res => {
//             this.versions = res;
//             this.loading = false;
//         });
//   }

  constructor() {}

  ngOnInit(): void {
      this.transformVersion(this.data).then( res => {
               this.versions = res;
               this.loading = false;
          });
  }

//   onNoClick(): void {
//       this.dialogRef.close();
//   }

  getDifference(current, after): any[] {
      const changes = [];
      const keysCurrent = Object.keys(current);
      keysCurrent.forEach( key => {
          if (after[key]) {
              if (after[key] !== current[key]) {
                  changes.push('Change value of field <i>' + key + '</i> from <b>' + after[key] +
                  '</b> to <b>' + current[key] + '</b>');
              }
          } else {
              changes.push('Add field <i>' + key + '</i> with value <b>' + current[key] + '</b>');
          }
      });

      const keysAfter = Object.keys(after);
      keysAfter.forEach( key => {
          if (!current[key]) {
              changes.push('Remove field <i>' + key + '</i> with value <b>' + after[key] + '</b>');
          }
      });
      return changes;
  }

  async transformVersion(data): Promise<any[]> {
      const res = [];
      const versions = data.versions;
      if (versions.length === 0) {
        return res;
      }
      for (let i = 1; i < versions.length; i++) {
          res.push({created : versions[i - 1].createdAt, createdBy :  versions[i - 1].createdBy?.name , changes : this.getDifference(versions[i - 1].data, versions[i].data)});
      }
      res.push({created : versions[versions.length - 1].createdAt,
        createdBy : versions[versions.length - 1].createdBy?.name,
        changes : this.getDifference(data.data, versions[versions.length - 1].data)});
      return res.reverse();
  }

  onHistoryClose(): void {
    console.log('clicked');
  }

}
