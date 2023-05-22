import { Injectable } from '@angular/core';
import {  } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { QueryParam } from 'src/models/authorization-models/query-param';
import { firstValueFrom, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  public getWithApiUrl<T>(path: string, queryParams: any) : Promise<T>
  {
    var httpParams = new HttpParams({
      fromObject: queryParams
    });
    
    // if(queryParams && Object.entries(queryParams).length > 0)
    // {
    //   console.log("here 001");
    //   let keys = Object.keys(queryParams);

    //   for (const key of keys)
    //   {
    //     console.log("here 002", key);

    //     if(queryParams[key] !== null && queryParams[key] !== undefined)
    //     {
    //       console.log("here 003", queryParams[key]);

    //       httpParams.append(key, queryParams[key]);
    //     }
    //   }
    // }

    return firstValueFrom(this.httpClient.get<T>(environment.apiUrl + '/' + path, {
      params: httpParams
    }));
  }

  public postWithApiUrl<T>(path: string, body: Object) : Promise<T>
  {
    return firstValueFrom(this.httpClient.post<T>(environment.apiUrl + '/' + path, body)) ;
  }

  public deleteWithApiUrl(path: string) : Promise<any>
  {
    return firstValueFrom(this.httpClient.delete(environment.apiUrl + '/' + path)).catch(() => {});
  }
}
