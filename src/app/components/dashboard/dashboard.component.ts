import { Component, OnInit, ViewChild } from '@angular/core';

import { ClaimsMockData } from '../mock-data/claims-list-constant';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthServiceService } from 'src/app/Services/auth-service.service';

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
  public claimsData: any = [];
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
  roles: string = "";
  selectedDay: any;
  notifyObj = new Notifier();
  facilityId:string='';
  facilities: any;
  tempData1: any;
  tempData2: any;
  customer: any;
  constructor(private http: ClaimsApiService) { }

  ngOnInit(): void {
    this.openClaims = this.claims;
    this.closedClaims = this.claims;

    this.http.getClaims().subscribe((data) => {
          this.claims = data;
          this.tempData = this.claims
        })
        this.http.getFacility().subscribe((data) => {
          this.facilities = data;
          this.tempData1 = this.facilities
        })

        this.http.getCustomer().subscribe((data) => {
          this.customer = data;
          this.tempData2 = this.customer
        })

  }

  facilityChange(facilityId: string) {
    this.facilityId = facilityId;
  }

  yearrange(event: any) {
    this.selectedDay = {
      value: event.value,
      text: event.source.triggerValue
    };
    let b;
    let c;
  if (this.selectedDay.text!=''){
     b = this.tempData1.filter((x: any) => {
      let event12 = new Date(x.createdDate);
      if (event12.getFullYear() == this.selectedDay.text) {
        return true;
      } else {
        return false;
      }
    })
     c = this.tempData2.filter((x: any) => {
      let event12 = new Date(x.createDate);
      if (event12.getFullYear() == this.selectedDay.text) {
        return true;
      } else {
        return false;
      }
    })
  }
  else{
     b=this.tempData1;
    c=this.tempData2
  }
    this.facilities = [...b]
    this.customer = [...c]
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
      this.claimsData = this.claimsData.filter((data: any) => {
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
