import { Component, Input, OnInit } from '@angular/core';
import { ClaimsApiService } from 'src/app/Services/claims-api.service';
import { Color } from 'ng2-charts';
import * as moment from 'moment';
@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css']
})
export class DoughnutChartComponent implements OnInit {
  @Input() claimData: any[] = [];
  totalClaims: any = [];
  doughnutclaims: any = [];
  @Input() set facilityId(id: string) {
    this.facilityChange = id;
    this.facilityCheck();
  };
  constructor(private http: ClaimsApiService) { }
  facilityChange: string = '';
  public doughnutChartLabels: any[] = [];
  public doughnutChartData: any[] = [];
  public doughnutChartType: any = 'doughnut';
  public doughnutOptions: any = {
    responsive:true,
    segmentShowStroke: false,
    animateScale: true,
    centerText: {
      display: true,
      text: "280"
    },
    showInLegend: false, 
    legend: {
      position: 'right',
      display: true,
      labels: {
        boxWidth: 10
    }
      
    }
  };
  public doughnutChartColor: Color[] = [
    { backgroundColor: ['#FF9021', '#4BC0C0', '#36A2EB', '#FF6484', '#13FFFF', '#64FF16', '#FFA3B5', '#FFC898', '#FFE0A1', '#A0D0F5', '#9966FF'] },
  ];
  isLoading: boolean = false;



  facilityCheck(): void {
    if (this.facilityChange) {
      this.isLoading = true;
      this.http.getClaimByFacility(this.facilityChange).subscribe((data:any) => {
        this.isLoading = false;
        this.doughnutChartLabels = [];
      this.doughnutChartData = [];
      let ele: any = {};
      data.map((item: any) => {
        if (ele[item.claimStatus]) {
          ele[item.claimStatus] += 1;
        } else {
          ele[item.claimStatus] = 1;
        }
      })
      let values = Object.entries(ele);
      values.forEach((status: any) => {
        this.doughnutChartLabels.push(status[0] + ' - ' + status[1]);
        this.doughnutChartData.push(status[1]);
      })
      })

    } else {
      this.ngOnInit();
    }
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.http.getClaims().subscribe((data: any) => {

      this.totalClaims = data;
      this.isLoading = false;
      this.doughnutChartLabels = [];
      this.doughnutChartData = [];
      let ele: any = {};
      data.map((item: any) => {
        if (ele[item.claimStatus]) {
          ele[item.claimStatus] += 1;
        } else {
          ele[item.claimStatus] = 1;
        }
      })
      let values = Object.entries(ele);
      values.forEach((status: any) => {
        this.doughnutChartLabels.push(status[0] + ' - ' + status[1]);
        this.doughnutChartData.push(status[1]);
      })
    })
   
  }
  chartrender(doughnutclaims:any){

    if (doughnutclaims.length === 0) 
    {
      this.doughnutChartLabels = [];
      this.doughnutChartData = [];
      console.log("null");

    }
    else(doughnutclaims.length != 0) 
    {
      this.doughnutChartLabels = [];
      this.doughnutChartData = [];
      let ele: any = {};
      doughnutclaims.map((item: any) => {
        if (ele[item.claimStatus]) {
          ele[item.claimStatus] += 1;
        } else {
          ele[item.claimStatus] = 1;
        }
      })
      let values = Object.entries(ele);
      values.forEach((status: any) => {
        this.doughnutChartLabels.push(status[0] + ' - ' + status[1]);
        this.doughnutChartData.push(status[1]);
      })

    }

  }

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
  
    let start = dateRangeStart.value;
    let end = dateRangeEnd.value;
    this.totalClaims.map((element: any) => {
      (element.createdDate = moment(element.createdDate).format("YYYY-MM-DD"))

    })

    this.doughnutclaims = this.totalClaims.filter((m: any) => new Date(m.createdDate) >= new Date(start) && new Date(m.createdDate) <= new Date(end));

    this.chartrender(this.doughnutclaims)

  }
}
