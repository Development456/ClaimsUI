import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { ClaimsApiService } from 'src/app/Services/claims-api.service';
import { Claim } from '../model/claim.model';
import { PaymentData } from '../mock-data/payment-details'
@Component({
  selector: 'app-claims-details',
  templateUrl: './claims-details.component.html',
  styleUrls: ['./claims-details.component.css']
})
export class ClaimsDetailsComponent implements OnInit, OnDestroy {
  ordersList: any = [];
  filteredColumns: any = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  claimAmount: any = {};
  claimData: any = {};
  userMode: string | null = 'user';
  firstFormGroup!: FormGroup;
  contactInformation!: FormGroup;
  costDetails!: FormGroup;
  paymentInformation!: FormGroup;
  additionalInfo!: FormGroup;
  claimsUpdatedData = {} as Claim ;
  facilityList: any = [];
  // customerList: string[] = [];
  customerList: any = [];
  updateCalims: Subscription = new Subscription();
  isLoading: boolean = false;
  editdata:any
  paymentData : any = [];

  constructor(public dialogRef: MatDialogRef<ClaimsDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
              private _formBuilder: FormBuilder, 
              private http: ClaimsApiService, 
              private _snackBar: MatSnackBar) {
              }

  ngOnInit(): void {
    console.log('test', this.data.rowData)
    // this.initializeForm();
    this.isLoading = true;
    this.userMode = localStorage.getItem('userDetails') ? localStorage.getItem('userDetails') : 'user';
    this.http.getFacility().subscribe((data: any) => {
      console.log(data,'22222222');
      this.isLoading = false;
      this.facilityList = data;

      this.http.getCustomer().subscribe((data:any)=>{
        console.log(data,'111111111',this.data.rowData.createdDate);
        this.isLoading = false;
      this.customerList = data;
      // console.log(this.customerList.filter((res:any)=>res.customerId==this.data.rowData.customerId)[0]?.lastUpdateDate)
      this.editdata=this.customerList.filter((res:any)=>res.customerId==this.data.rowData.customerId)[0]
      console.log(this.editdata,'lastupdated date');
      this.initializeForm();
      })

      this.http.getClaimsById("999").subscribe((data:any)=>{
        console.log(data,'33333'); 
      }) 
    });

    this.paymentData = PaymentData[0];
    console.log(this.paymentData);
    
  


    setTimeout(() => {
      this.ordersList = this.data.orders;
    }, 500)
    this.filteredColumns = [{ "name": "Item", "props": "item", width: 60 }, 
                            { "name": "Description", props: "des"}, 
                            { "name": "Date Code", props: "dateCode" },
                            { "name": "LOT", props: "lot" }, 
                            { "name": "Quantity", props: "quantity" },
                            { "name": "LPN", props: "LPN" },
                            { "name": "NET", props: "NET" }];

    this.firstFormGroup.controls['customerClaim'].disable();
  }

  initializeForm() {
    this.firstFormGroup = this._formBuilder.group({
      createdDate: [new Date(this.data.rowData.createdDate), Validators.required],
      closedDate: [new Date(this.editdata.lastUpdateDate), Validators.required],
      customerClaim: [this.data.rowData.serviceProviderClaimId],
      // customer: ['', Validators.required],
      customer: [this.data.rowData.customerId, Validators.required],
      facility: [this.data.rowData.facilityId, Validators.required],
      wmsAccount: ['123', Validators.required],
      claimType: [this.data.rowData.claimType.toLowerCase().charAt(0).toUpperCase() + this.data.rowData.claimType.toLowerCase().slice(1), Validators.required],
      claimCategory: [this.data.rowData.category, Validators.required],
      status: [this.data.rowData.claimStatus, Validators.required],
      priorityFlag: ['Low', Validators.required],
      commonType: ['Low', Validators.required],
      issueType: ['Low', Validators.required],
    });

    this.contactInformation = this._formBuilder.group({
      name: [this.editdata.name, Validators.required],
      // phone: ['1111111111', Validators.required],
      phone: [this.editdata.phone, Validators.required],
      email: [this.editdata.email, Validators.required],

    });

    this.costDetails = this._formBuilder.group({
      amountBasis: ['Product', Validators.required],
      cost: [this.data.rowData.claimedAmount.slice(1), Validators.required],
      currency: ['USD', Validators.required],

    });

    this.paymentInformation = this._formBuilder.group({
      apVendor: [this.paymentData.apVendor, Validators.required], 
      paidAmount: [this.data.rowData.paidAmount.slice(1), Validators.required],
      paymentReference: [this.paymentData.paymentReference, Validators.required], 
      paymentDate: [this.paymentData.paymentDate, Validators.required],
      invoiceNumber: [this.paymentData.invoiceNumber, Validators.required], 
      costCenter: [this.paymentData.costCenter, Validators.required],
      glCode: [this.paymentData.glCode], 
      accuralAmount: [this.paymentData.accuralAmount, Validators.required],
      invoiceAmount: [this.paymentData.invoiceAmount], 
      claimedAmount: [this.data.rowData.claimedAmount.slice(1), Validators.required],
      currencyType: [this.paymentData.currencyType, Validators.required],

    });

    this.additionalInfo = this._formBuilder.group({
      notes: [''], 
      document: ['']
    });
  }

  saveClaimDetails() {
    this.editServiceCall(this.firstFormGroup.value, this.costDetails.value, this.paymentInformation.value);
    
    this.isLoading = true;
    this.updateCalims = this.http.updateClaim(this.claimsUpdatedData, this.data.rowData.serviceProviderClaimId).subscribe((data)=>{
      console.log(this.claimsUpdatedData,);
      console.log('Edit succesful!!')
      this.isLoading = false;
      this._snackBar.open("Progress Saved", "Close", {  duration: 5000 });
      // this.dialogRef.close({data: this.claimsUpdatedData});
    }, 
    (error) => {
      this.isLoading = false;
      this._snackBar.open("Error while Editing", "Close", {  duration: 3000 });
    });
    
    console.log(this.paymentInformation);
    
  }

  editServiceCall(firstFormGroup: any, costDetails: any, paymentInformation: any) {
    //console.log(firstFormGroup,"F.F.G",this.dateFormat(firstFormGroup.createdDate).toString(),paymentInformation,"P.I");
    //console.log(this.data);
    this.claimsUpdatedData._id = this.data.rowData._id;
    this.claimsUpdatedData.createdDate = this.formatDate(firstFormGroup.createdDate);
    this.claimsUpdatedData.closedDate = this.formatDate(firstFormGroup.closedDate);
    this.claimsUpdatedData.claimId= this.data.rowData.claimId.trim();
    this.claimsUpdatedData.facilityId = firstFormGroup.facility;
    this.claimsUpdatedData.customerId = firstFormGroup.customer;
    this.claimsUpdatedData.palletQuantity = this.data.rowData.palletQuantity;
    this.claimsUpdatedData.documentType = this.data.rowData.documentType;
    this.claimsUpdatedData.claimedAmount = costDetails.cost.toString();
    this.claimsUpdatedData.serviceProviderClaimId = firstFormGroup.customerClaim;
    this.claimsUpdatedData.claimStatus = firstFormGroup.status;
    this.claimsUpdatedData.claimType = firstFormGroup.claimType.toUpperCase();
    this.claimsUpdatedData.creatorId = '';
    this.claimsUpdatedData.paidAmount = paymentInformation.paidAmount.toString();
    // this.claimsUpdatedData.lastUpdateId = this.data.rowData.lastUpdateId.trim();
    // this.claimsUpdatedData.lastUpdateDate = this.data.rowData.lastUpdateDate.trim();
    return this.claimsUpdatedData;
  }

  

  ngOnDestroy(): void {
    if(this.updateCalims) {
      this.updateCalims.unsubscribe();
    }
  }

  addQuantity(e: any, row: any) {
    console.log(row);
    this.claimAmount[row.item] = e.target.value * 5;
    let total = 0;
    for (let amount of Object.keys(this.claimAmount)) {
      total += this.claimAmount[amount];
    }
    this.costDetails.setValue({
      amountBasis: this.costDetails.value.amountBasis ? this.costDetails.value.amountBasis : 'Product',
      cost: total,
      currency: this.costDetails.value.currency ? this.costDetails.value.currency : 'USD'
    })
    this.paymentInformation.controls['claimedAmount'].setValue(total);
    this.paymentInformation.controls['currencyType'].setValue(this.costDetails.value.currency ? this.costDetails.value.currency : 'USD');
  }

  formatDate(date: any) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
        switch (month){
          case '1':
            month = 'JAN';
            break;
          case '2':
            month = 'FEB';
            break;
          case '3':
            month = 'MAR';
            break;
          case '4':
            month = 'APR';
            break;
          case '5':
            month = 'MAY';
            break;
          case '6':
            month = 'JUN';
            break;
          case '7':
            month = 'JUL';
            break;
          case '8':
            month = 'AUG';
            break;
          case '9':
            month = 'SEP';
            break;
          case '10':
            month = 'OCT';
            break;
          case '11':
            month = 'NOV';
            break;
          case '12':
            month = 'DEC';
            break;
        }
    if (day.length < 2) 
        day = '0' + day;
        
    return [day, month, year].join('-');
  }

  home(){
    // this.dialogRef.close({data: this.claimsUpdatedData});
    this.dialogRef.close();
  }
}
