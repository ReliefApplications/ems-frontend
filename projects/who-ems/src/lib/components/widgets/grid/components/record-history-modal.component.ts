import { Component, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'record-history-modal',
    templateUrl: 'record-history-modal.html',
  })

export class RecordHistoryModal {

    versions = [];
    loading = true;

    constructor(
        public dialogRef: MatDialogRef<RecordHistoryModal>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.transformVersion(data.versions).then( res => {
                this.versions = res;
                this.loading=false;
            });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    async transformVersion(data) {
        console.log(data);
        let res = []
        for (let i = 0; i <= data.length; i++) {
            let version = data[i]
            let created = version.createdAt
            //console.log(version.createdAt)
            //res.push({'created' : version.createdAt});
            res.push({'created' : created});
        }
        console.log(res);
        return res;

    }





}