import * as XLSX from 'xlsx';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

import { AddClaimColumns } from '../mock-data/add-claim-columns.constant';
import { ClaimsApiService } from 'src/app/claims-api.service';
import { ClaimsDetailsComponent } from '../claims-details/claims-details.component';
import { ClaimsHomeTableColumns } from '../mock-data/claims-home-columns.constants';
import { DatePipe } from '@angular/common'
import { DetailsModalComponent } from "./details-modal/details-modal.component"
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { zip } from 'rxjs';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
@Component({
	// encapsulation: ViewEncapsulation.None,
	selector: 'app-data-table',
	templateUrl: './data-table.component.html',
	styleUrls: ['./data-table.component.css'],
	changeDetection: ChangeDetectionStrategy.Default
})
export class DataTableComponent implements OnInit {
	@Input() rows: any[] = [];
	@Output() newItemEvent: any = new EventEmitter();
	@Input() showActions: boolean = true;
	@Input() set facilityId(id: string) {
		this.facilityChange = id;
		// this.facilityCheck();
		this.ngOnInit();
	};
	showGrid = true;
	facilityChange: string = '';
	sortingfilters = false;
	campaignOne = new FormGroup({
		start: new FormControl(),
		end: new FormControl(),
	});
	campaignTwo = new FormGroup({
		start: new FormControl(),
		end: new FormControl(),
	});
	tableType = "claim";
	public columns = ClaimsHomeTableColumns;
	public filteredColumns: any;
	public ColumnMode = ColumnMode;
	public rowHeight = 40;
	public show = false;
	selected = [];
	mySelection = [];
	SelectionType = SelectionType;
	filteredRows: any[] = [];
	filteredObject: any;
	filteredRowsAutoFill: any = {};
	storedRows: any = [];
	isLoading: boolean = false;
	filterForm!: FormGroup;
	facilityList: any = [];
	customerList: any = [];
	filtersOption: any = {};
	resetValue = new FormControl();

	constructor(public dialog: MatDialog, private http: ClaimsApiService,
		 private cd: ChangeDetectorRef, 
		 private _formBuilder: FormBuilder,
		 public datepipe: DatePipe) {
	}
	ngOnInit(): void {
		this.showGrid = false;
		this.filteredColumns = this.columns.filter(column => column.show === true);
		this.filterColumnsForm();
		this.getFacilityChange();
		this.cd.markForCheck();

		this.filteredRowsAutoFill = this.columns.map((item: any) => item.props);
		this.campaignOne.valueChanges.subscribe(data => {
			if (data.start && data.end) {
				this.filteredRows = this.storedRows.filter((item: any) => {

					let dateCheck = new Date(item.creationDate);

					let lowDate = new Date(data.start);
					let highDate = new Date(data.end);

					if (dateCheck.getTime() <= highDate.getTime() && dateCheck.getTime() >= lowDate.getTime()) {
						return true;
					} else return false;
				})
			}
		})
	}
	
	filterColumnsForm() {
		this.filterForm = this._formBuilder.group({
			claimStatus: [''],
			masterAcct: [''],
			documentType: [''],
			facilityId: [''],
			account: [''],
			serviceProviderClaimId: [''],
			claimType: [''],
			category: [''],
			palletQuantity: [''],
			claimedAmount: [''],
			paidAmount: [''],
			carrier: [''],
			loadNumber: ['']
		},  { validators: this.atLeastOneValidator })
	}

	public atLeastOneValidator: any = (control: FormGroup): ValidationErrors | null => {
		let controls = control.controls;
		if (controls) {
		  let theOne = Object.keys(controls).findIndex(key => controls[key].value !== '');
		  if (theOne === -1) {			
			return {
			  atLeastOneRequired: {
				text: 'At least one should be selected'
			  }
			}
		  }
		};
		 return null;
	  }

	public togglecolumnCheckbox(column: any) {
		const isChecked = column.show;
		column.show = !isChecked;
		this.filteredColumns = this.columns.filter(item => item.show);
	}

	public onExportToExcel() {
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredRows);
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb, 'claims.xlsx');
	}
	openDialog(row: any) {
		const dialogRef = this.dialog.open(DetailsModalComponent, {
			height: '600px',
			width: '1000px', data: row, autoFocus: false
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}

	editItem(row: any, index: any) {
		const dialogRef = this.dialog.open(ClaimsDetailsComponent, { data: { orders: this.http.getOrders(), rowData: row }, autoFocus: false });

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				location.reload();
			}
		});
	}

	filteredApplied(event: any, props: string) {
		this.filtersOption[props] = event.target.value;
		this.filteredRows = this.storedRows;
		for (let filter of Object.keys(this.filtersOption)) {
			if (this.filtersOption[filter] != '') {
				this.filteredRows = this.filteredRows.filter(row => {
					return row[filter].indexOf(this.filtersOption[filter]) > -1 ? 1 : 0;
				})
			}
		}
	}

	getFacilityChange() {
		this.isLoading = true;
		this.http.getClaimByFacility(this.facilityChange).subscribe((data: any) => {
			this.isLoading = false;
			 //this.rows = data;
			if (data.length > 0) {
				data = data.reverse();
			}
			this.storedRows = data.map((item: any, index: number) => {
				if (!item.creationDate) {
					item.creationDate = this.rows[index]?.date
				}
				item.claimedAmount = Number(item.claimedAmount ? item.claimedAmount : 0);

				return { ...this.rows[index], ...item }
			});
			this.filteredRows = data.map((item: any, index: number) => {
				if (!item.creationDate) {
					item.creationDate = this.rows[index]?.date
				}
				item.claimedAmount = '$' + Number(item.claimedAmount ? item.claimedAmount : 0);
				return { ...this.rows[index], ...item }
			});
			this.showGrid = true;
		});
	}

	resetFilterApplied() {
		this.getFacilityChange();
		this.filtersOption = {};
		this.campaignOne.reset();
		this.campaignTwo.reset();
		this.filterForm.reset();
		this.filteredRows = this.storedRows;
	}

	searchFilter() {
		if (this.filterForm.dirty || this.campaignOne.dirty ){
			this.http.filterClaim(this.filterForm, this.datepipe.transform(this.campaignOne.get('start')?.value, 'dd-MMM-yyyy')).subscribe((data: any) => {
				this.filteredRows = data.map((item: any, index: number) => {
					if (!item.creationDate) {
						item.creationDate = this.rows[index].date
					}
					item.claimedAmount = '$' + Number(item.claimedAmount ? item.claimedAmount : 0);
					return { ...this.rows[index], ...item }
				});
			});
		
		}	
	}
}

@Component({
	// encapsulation: ViewEncapsulation.None,
	selector: 'app-data-order-table',
	templateUrl: './data-table.component.html',
	styleUrls: ['./data-table.component.css'],
	changeDetection: ChangeDetectionStrategy.Default
})
export class DataTableOrdersComponent implements OnInit {
	@Input() rows: any[] = [];
	@Output() newItemEvent: any = new EventEmitter();
	@Input() showActions: boolean = true;
	sortingfilters = false;
	campaignOne = new FormGroup({
		start: new FormControl(),
		end: new FormControl(),
	});
	showGrid = true;

	campaignTwo = new FormGroup({
		start: new FormControl(),
		end: new FormControl(),
	});
	tableType = "order";
	public columns = AddClaimColumns;
	public filteredColumns: any;
	public ColumnMode = ColumnMode;
	public rowHeight = 40;
	public show = false;
	selected = [];
	mySelection = [];
	SelectionType = SelectionType;
	filteredRows: any[] = [];
	addedClaims: any = [];
	facilityList: any = [];
	customerList: any = [];
	filteredObject = this._formBuilder.group({
		facility: [''],
		customer: ['']
	})
	isLoading: boolean = false;
	filterForm!: FormGroup;

	constructor(public dialog: MatDialog, private http: ClaimsApiService, private _formBuilder: FormBuilder,
		private cd: ChangeDetectorRef, private toastr: ToastrService) {
	}

	ngOnInit(): void {
		this.isLoading = true;
		this.filteredColumns = this.columns.filter(column => column.show === true);
		this.filteredRows = this.rows;
		let source$ = zip(this.http.getFacility(), this.http.getCustomer());
		source$.subscribe(([facility, Customer]) => {
			this.isLoading = false;
			this.facilityList = facility;
			this.customerList = Customer;

		})
	}
	public togglecolumnCheckbox(column: any) {
		const isChecked = column.show;
		column.show = !isChecked;
		this.filteredColumns = this.columns.filter(item => item.show);
	}

	public onExportToExcel() {
		try {
			this.toastr.success('Export Excel', 'Export to Excel Success!');

			const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredRows);
			const wb: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
			XLSX.writeFile(wb, 'claims.xlsx');
		} catch (e) {
			this.toastr.warning('Export Excel', 'Export to Excel Failed!');

		}

	}
	openDialog(row: any) {
		const dialogRef = this.dialog.open(DetailsModalComponent, {
			height: '400px',
			width: '600px', data: row, autoFocus: false
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}
	editItem(row: any, index: any) {
		this.toastr.info('Order Selected', 'Claim Details');

		this.addedClaims.push(row);
		this.newItemEvent.emit(this.addedClaims);
		// const dialogRef = this.dialog.open(ClaimsDetailsComponent, { data: { orders: this.http.getOrders() }, autoFocus: false });

		// dialogRef.afterClosed().subscribe(result => {
		// 	console.log(`Dialog result: ${result}`);
		// });
	}
	filtersOption: any = {};
	filteredApplied(event: any, props: string) {
		console.log(event, props)
		this.filtersOption[props] = event.target.value;
		this.filteredRows = this.rows;
		for (let filter of Object.keys(this.filtersOption)) {
			if (this.filtersOption[filter] != '') {
				this.filteredRows = this.filteredRows.filter(row => {
					return row[filter].toString().indexOf(this.filtersOption[filter]) > -1 ? 1 : 0;
				})
			}
		}
	}

	resetValue = new FormControl();
	resetFilterApplied() {
		this.filtersOption = {};
		this.resetValue.reset();
		this.filteredRows = this.rows;
	}

	searchFilter() {
	}
}