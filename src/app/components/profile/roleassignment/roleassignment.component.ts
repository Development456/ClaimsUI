import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { RoleUserListTableColumns } from '../../mock-data/role-userList-col';
import { UserRoles } from '../../model/claim.model';

@Component({
  selector: 'app-roleassignment',
  templateUrl: './roleassignment.component.html',
  styleUrls: ['./roleassignment.component.css']
})
export class RoleassignmentComponent implements OnInit {
  // @Input() dashboard: any;
  // @ViewChild(MatDrawer) drawer: any;
	@Input() showActions: boolean = true;
	public filteredColumns: any;
	filteredRows: any[] = [];
	// public rowHeight = auto;
	public ColumnMode = ColumnMode;
	SelectionType = SelectionType;
	public show = false;
  public columns = RoleUserListTableColumns;
  public rows: any[] = [];
  showGrid = true;
	filteredRowsAutoFill: any = {};
  public roles: any[] = [];

 


  constructor(private authService: AuthServiceService, private token: TokenStorageService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.showGrid = false;
		this.filteredColumns = this.columns.filter(column => column.show === true);
		this.filteredRowsAutoFill = this.columns.map((item: any) => item.props);
    this.getUsersList();
    this.getRolesByID();
   
  }


  getUsersList(){
    this.authService.getUserList().subscribe(data => {
      console.log(data, 'userlist');
      this.rows = data;
    });
  }

  getRolesByID(){
    this.authService.getRolesByID().subscribe(data => {
      var stringObject:any;
      stringObject=JSON.stringify(data);
      stringObject=JSON.parse(stringObject);
      let roleData:UserRoles = <UserRoles>stringObject;
      this.roles = roleData.roles[0]['name'];
      console.log(this.roles, 'role')

    });
  }

  userListFilter(event: any){
    let val = event.target.value
    console.log(val, 'event');
    this.filteredRows = this.rows;
     this.filteredRows = this.filteredRows.filter(data =>{
      return data.username.indexof(val)> -1 ? 1 : 0;
    });
    this.rows = this.filteredRows;
    // this.table.offset = 0
  }

  getRole(){
    const dialogRef = this.dialog.open(RolesComponent, {width:'400px'});
    dialogRef.afterClosed().subscribe(result => {
			if (result) {
				location.reload();
			}
		});
  }
}


@Component({
  selector: 'roles-component',
  styleUrls:['./roleassignment.component.css'],
  template: `
  <mat-card>
    <mat-card-header style="background-color: #c5bbad;border-radius:4px;">
                <mat-card-title style="margin-top: 10px;">Roles
                <!-- <mat-icon class="float-end" mat-dialog-close mat-icon-button>close</mat-icon> -->

              </mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <section class="align">
        <span *ngFor="let role of roles">
            <mat-checkbox class="boxMargin" color="warn">{{role.name}}</mat-checkbox>
        </span> 
      </section>
    </mat-card-content> 
   <mat-card-actions>
      <button mat-button>Reset</button>
      <button mat-button color="primary" class="float-end">Save</button>
    </mat-card-actions>
  </mat-card>`,

})
export class RolesComponent implements OnInit{
  public roles !: UserRoles[];

constructor(private authService: AuthServiceService){}
  ngOnInit(): void {
    this.getRoles();
  }
  getRoles(){
    this.authService.getRoles().subscribe(data => {
      this.roles = data;
      console.log(this.roles, 'Roles');
    });
  }
}
