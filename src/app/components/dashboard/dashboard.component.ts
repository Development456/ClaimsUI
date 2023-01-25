import { Component, OnInit, ViewChild } from '@angular/core';

import { ClaimsMockData } from '../mock-data/claims-list-constant';
import { MatDrawer } from '@angular/material/sidenav';
import { ClaimsApiService } from 'src/app/Services/claims-api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showFiller = true;
  @ViewChild(MatDrawer) drawer: any;
  navOptions = "home";
  years: any
  public claims: any = [];
  public openClaims: any[] = [];
  public closedClaims: any[] = [];
  public statusData: any = {};
  public openBarChartColor = '#36A2EB';
  public closedBarChartColor = '#FF6484';
  public openSize = 3000;
  public closedSize = 50000;
  selectedDataItems = [];
  tempData: any = []
  show = true;
  selectedDay: any;
  notifyObj = new Notifier();
  facilityId:string='';
  totalClaims: any=[];
  barclaims: any=[];

  isLoading:boolean = false;


  constructor(private http : ClaimsApiService) { }

  ngOnInit(): void {

    // this.claims = ClaimsMockData;
    // this.tempData = this.claims
    // this.openClaims = this.claims;
    // this.closedClaims = this.claims;
    this.http.getClaims().subscribe((data)=>{
      this.totalClaims = data;
      this.initFilter(this.totalClaims)
      
    }) 

  }

  public initFilter(barclaims:any): void {
 
    this.openClaims = barclaims.filter((claim:any)=> claim.claimStatus === 'Open');

    this.openClaims.forEach((elem: any) => {
      elem.claimedAmount = +elem.claimedAmount.toString().substring(1).replace(',','');
    })

    this.openClaims = this.openClaims.sort((a: any, b: any) => b.claimedAmount - a.claimedAmount).slice(0,5);



    this.closedClaims = barclaims.filter((claim: any) => claim.claimStatus === 'Closed');

    this.closedClaims.forEach((elem: any) => {
      elem.claimedAmount = +elem.claimedAmount.toString().substring(1).replace(',','');
    })

    this.closedClaims = this.closedClaims.sort((a: any, b: any) => b.claimedAmount - a.claimedAmount).slice(0,5);


    
    this.totalClaims.forEach((element: any) => {
      if (this.statusData.hasOwnProperty(element.status)) {
        this.statusData[element.status] += 1;
      }
      else {
        this.statusData[element.status] = 1;
      }
      }
    )
  
  }

  dateRangeChange(dateRangeStart : HTMLInputElement, dateRangeEnd: HTMLInputElement){

    this.barclaims = []
    this.openClaims = []
    this.closedClaims = []
    
    // this.isLoading = true;

    let start = dateRangeStart.value;

    let end = dateRangeEnd.value;

    this.totalClaims.map((element: any) => {
      (element.createdDate = moment(element.createdDate).format("YYYY-MM-DD"))

    })    
    
    this.isLoading = false;

    this.barclaims = this.totalClaims.filter((m: any) => new Date(m.createdDate) >= new Date(start) && new Date(m.createdDate) <= new Date(end));
        
    this.openClaims = this.barclaims;
    this.closedClaims = this.barclaims


    this.initFilter(this.barclaims);

    setTimeout(() => {
      this.show = true;
    }, 0)
  

  }

  facilityChange(facilityId: string) {
    this.facilityId = facilityId;
  }

  yearrange(event: any) {
    this.selectedDay = {
      value: event.value,
      text: event.source.triggerValue
    };
    this.claims = [].concat(this.tempData.filter((x: any) => {
      let event12 = new Date(x.date);
      if (event12.getFullYear() == this.selectedDay.text) {
        return true;
      } else {
        return false;
      }
    }))
    this.notifyObj.valueChanged(this.claims);
  }
  selectedData(e: any) {
    this.selectedDataItems = e;
    this.navOptions = 'addClaim';
  }
  getYear(e: any) {
    this.show = false;
    this.years = Number(e.value);
    this.ngOnInit();

    setTimeout(() => {
      this.claims = this.claims.filter((data: any) => {
        let event = new Date(data.date);
        if (event.getFullYear() == this.years) {
          return true;
        } else {
          return false;
        }

      })
      this.show = true
    }, 0)
  }
}

export class Notifier {
  valueChanged: (data: any) => void = (data: any) => { };
}
