import { OrderList } from '../components/mock-data/order-list.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment} from 'src/environments/environment';
// import { environment} from 'src/environments/environment.prod';

import { catchError, Observable, of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ClaimsApiService {

  ordersList = OrderList;

  constructor(private http: HttpClient, private toastr: ToastrService	) { }

  getFacility() {
    return this.http.get(environment.FACILITY + `/facility`).pipe(catchError((err:any ) => {
      this.toastr.error('Api Failure with status code : '+ err.status, 'Get Facility Failed');
      return of([]);
    }));
  }

  getCustomer() {
    return this.http.get(environment.CUSTOMER + `/customer`).pipe(catchError((err:any ) => {
      this.toastr.error('Api Failure with status code : '+ err.status, 'Get Customers Failed');
      return of([]);
    }));
  }

  getCustomerReference() {
    return this.ordersList.map(item => {
      return item.customerReference;
    })
  }
  getAMCReference() {
    return this.ordersList.map(item => {
      return item.AMCRefenrence;
    })
  }
  getOrders() {
    return this.ordersList;
  }

  getClaims() {
    return this.http.get(environment.CLAIM + '/claims').pipe(catchError((err:any ) => {
      this.toastr.error('Api Failure with status code : '+ err.status, 'Get Claims Failed');
      return of([]);
    }));
  }

  getClaimsById(id: string) {
    return this.http.get(environment.CLAIM+ `/claims/${id}`).pipe(catchError((err:any ) => {
      this.toastr.error('Api Failure with status code : '+ err.status, 'Get Claims by ID Failed');
      return of([]);
    }));
  }

  getClaimByFacility(id: string) {
    if (id) {
      return this.http.get(environment.CLAIM + `/claims/facility/${id}`).pipe(catchError((err:any ) => {
        this.toastr.error('Api Failure with status code : '+ err.status, 'Get Facility by ID Failed');
        return of([]);
      }));
    } else {
      return this.getClaims();
    }
  }

  createClaim(claim: Object) {
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

    return this.http.post(environment.CLAIM + '/claims/addclaims', claim,{headers}).pipe(catchError((err:any ) => {
      this.toastr.error('Api Failure with status code : '+ err.status, 'Post Claims Failed');
      return of([]);
    }));
  }

  updateClaim(editedCalimsBody: any, serviceProviderId: number) {
    const url = environment.CLAIM + `/claims/${serviceProviderId}`;
    return this.http.put<any>(url, editedCalimsBody).pipe(catchError((err:any ) => {
      this.toastr.error('Api Failure with status code : '+ err.status, 'Update Claims by ID Failed');
      return of([]);
    }));
  }

  filterClaim(filterMap: any, date: any): Observable<any> {

    let headersParams = new HttpHeaders().set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');
    
    if( filterMap.get('facilityId')?.value ){
    headersParams = headersParams.set('facilityId', filterMap.get('facilityId')?.value)
    }
    if( filterMap.get('claimId')?.value ){
      headersParams = headersParams.set('claimId', filterMap.get('claimId')?.value)
    }
    // if( filterMap.get('palletQuantity')?.value ) {
    // headersParams = headersParams.set('palletQuantity', filterMap.get('palletQuantity')?.value.toString())
    // }
    if( filterMap.get('documentType')?.value ) {
    headersParams = headersParams.set('documentType', filterMap.get('documentType')?.value)
    }
    if( filterMap.get('claimedAmount')?.value ) {
    headersParams = headersParams.set('claimedAmount', filterMap.get('claimedAmount')?.value)
    }
    if( filterMap.get('paidAmount')?.value ) {
      headersParams = headersParams.set('paidAmount', filterMap.get('paidAmount')?.value)
    }
    // if( filterMap.get('serviceProviderClaimId')?.value ) {
    // headersParams = headersParams.set('serviceProviderClaimId', filterMap.get('serviceProviderClaimId')?.value)
    // }
    if( filterMap.get('claimStatus')?.value ) {
    headersParams = headersParams.set('claimStatus', filterMap.get('claimStatus')?.value)
    }
    if( filterMap.get('masterAccount')?.value ) {
      headersParams = headersParams.set('masterAccount', filterMap.get('masterAccount')?.value)
    }
    if( filterMap.get('claimType')?.value ) {
    headersParams = headersParams.set('claimType', filterMap.get('claimType')?.value)
    }
    if( filterMap.get('userId')?.value ){
      headersParams = headersParams.set('userId', filterMap.get('userId')?.value)
    }
    if( date ) {
      headersParams = headersParams.set('createdDate', date)
    }
    const url = environment.CLAIM + '/claims/filter';
    return this.http.get<any>(url, {headers: headersParams})
    }


}


