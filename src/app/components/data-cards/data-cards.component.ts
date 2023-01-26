import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClaimsApiService } from 'src/app/Services/claims-api.service';
import { Notifier } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-data-cards',
  templateUrl: './data-cards.component.html',
  styleUrls: ['./data-cards.component.css']
})
export class DataCardsComponent implements OnInit {
  @Input() facilities: any = [];
  @Input() customersDropdown: any = []
  @Input() rowData: any[] = [];
  @Input() notify = new Notifier();
  @Output() year: any = new EventEmitter();
  @Output() facilityChange: any = new EventEmitter();
  @Input() selectedDay: any = [];
  public customers: any = [];
  public claims: any;
  public claimAmount = 0;
  public paidAmount = 0;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  selectedData: any;
  facility: any = [];
  facilityData: any;
  masterData: any = [];
  count: any;
  uniqueChars: any = [];
  claimed: any = [];
  paied: any = [];
  amountdata: any = [];
  amountdata1: any = [];
  totclaimamount: any = [];
  totpaidamount: any = [];
  Wearhouse: any;
  isFacilityLoading: boolean = false;
  isClaimsLoading: boolean = false;
  isCustomerLoading: boolean = false;
  abcd: any;
  totalClaims: any = [];
  filteredCustomerData: any = [];
  claimsByFacility: any = [];
  claimsBasedOnYear: any;

  constructor(private http: ClaimsApiService) { }

  ngOnInit(): void {
    this.isFacilityLoading = true;
    this.isClaimsLoading = true;
    this.isCustomerLoading = true;
    this.getFacility();
    this.getClaims('');
    this.getCustomer();
    this.Wearhouse = []
  }

  ngOnChanges() {
    this.filteredCustomerData = this.customersDropdown
    this.claimAmount = 0;
    this.paidAmount = 0;
    if (this.selectedDay.text != '') {
      let a = this.totalClaims.filter((x: any) => {
        let event12 = new Date(x.createdDate);
        if (event12.getFullYear() == this.selectedDay.text) {
          return true;
        } else {
          return false;
        }
      })
      a.forEach((element: any) => {
        this.claimAmount += Number(element.claimedAmount.replace(',', ''));
        this.paidAmount += Number(element.claimedAmount.replace(',', ''));
      });
      this.claims = a.length;
    }
    else {
      this.totalClaims.forEach((element: any) => {
        this.claimAmount += Number(element.claimedAmount.replace(',', ''));
        this.paidAmount += Number(element.claimedAmount.replace(',', ''));
      });
      this.claims = this.totalClaims.length;
      
    }
    this.claimsBasedOnYear=this.claims;
  }

  getFacility() {
    this.http.getFacility().subscribe((data) => {
      this.isFacilityLoading = false;
      this.facilities = data;
    },
      (error) => {
        this.isFacilityLoading = true;
      }
    )
  }
  getCustomer() {
    this.http.getCustomer().subscribe(data => {
      this.isCustomerLoading = false;
      this.customers = data;
    },
      (error) => {
        this.isCustomerLoading = true;
      }
    )
  }

  getClaims(facilityId: string) {

    this.claims = 0;
    this.claimAmount = 0;
    this.paidAmount = 0;
    this.http.getClaims().subscribe((data: any) => {
      this.isClaimsLoading = false;
      this.totalClaims = data
      if (!data.length) {
        this.customers = 1;
        this.claims = 1;
        this.claimAmount += Number(data?.claimedAmount?.replace(',', ''));
        this.paidAmount += Number(data?.claimedAmount?.replace(',', ''));
      } else {
        this.claims = data.length;
        this.customers = data;
        data.forEach((element: any) => {
          this.claimAmount += Number(element.claimedAmount.replace(',', ''));
          this.paidAmount += Number(element.claimedAmount.replace(',', ''));
        });
      }

    },
      (error) => {
        this.isClaimsLoading = true;
      });

    this.facilityChange.emit(facilityId);
  }

  ngAfterViewInit() {
    this.notify.valueChanged = (data: any) => {
      this.initFilter(data)
      this.rowData = data;
    };
  }
  public initFilter(data: any): void {
    this.claimAmount = 0;
    this.paidAmount = 0;
    data.forEach((element: any) => {
      let amount = typeof element.claimedAmount === 'string' ? +element.claimedAmount.substring(1) : element.claimedAmount;
      let paidAmount = +element.paidAmount.substring(1);
      this.claimAmount += amount ? amount : 0;
      this.paidAmount += paidAmount ? paidAmount : 0;
    });
  }

  changeFacility(e: any) {
    let a = this.customersDropdown.filter((res: any) => {
      return res.facilityId == e.value
    })
    a = (e.value == undefined) ? this.customersDropdown : a;
    this.filteredCustomerData = a;
    //  this.getClaims(e.value);
    let b = this.rowData.filter((res: any) => {
      return res.facilityId == e.value
    })

    b = (e.value == undefined) ? this.rowData : b;
    this.initFilter(b);
    this.claimsByFacility = b;
    this.claims = (e.value==undefined)?this.claimsBasedOnYear:b.length
    
  }

  changeCustomer(e: any) {
    let filteredData = this.claimsByFacility.filter((res: any) => {
      return res.customerId == e.value;
    })
    filteredData = (e.value == undefined) ? this.claimsByFacility : filteredData;

    this.claims = filteredData.length;
    this.initFilter(filteredData)
  }

}
