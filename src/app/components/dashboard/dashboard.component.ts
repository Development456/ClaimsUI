import { Component, OnInit, ViewChild } from '@angular/core';

import { ClaimsMockData } from '../mock-data/claims-list-constant';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { ClaimsApiService } from 'src/app/Services/claims-api.service';

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
  userRole:string='';
  constructor(private loginService: AuthServiceService,private claimsService: ClaimsApiService) { }

  ngOnInit(): void {
    this.loginService.user_Role.subscribe((role:any)=>{
      this.userRole = role;
    })
    var userDetails = window.sessionStorage.getItem('auth-user');
    var details = JSON.parse(userDetails || '{}');
    var userId = details.id;
    this.claimsService.getClaims().subscribe((claimdata:any)=>{
      if(this.userRole == 'user'){
        this.claimsData = this.filterByUserId(claimdata,userId);
        // console.log(this.claimsData.length);
      }else{
        this.claimsData = claimdata;
        // console.log("Admin",this.claimsData.length);
      }
      // console.log(this.claimsData);
      this.tempData = claimdata;
      this.openClaims = claimdata;
      this.closedClaims = claimdata;
    })
  }

  filterByUserId(claims:any[], userId:any) {
    return claims.filter(function(claim) {
      return claim.userId==userId
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
    this.claimsData = [].concat(this.tempData.filter((x: any) => {
      let event12 = new Date(x.date);
      if (event12.getFullYear() == this.selectedDay.text) {
        return true;
      } else {
        return false;
      }
    }))
    this.notifyObj.valueChanged(this.claimsData);
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
