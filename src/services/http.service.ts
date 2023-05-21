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

  public getWithApiUrl<T>(path: string, queryParams: QueryParam[]) : Promise<T>
  {
    var httpParams = new HttpParams();

    if(queryParams?.length > 0)
    {
      for (const queryParam of queryParams)
      {
        httpParams.set(queryParam.key, queryParam.value);
      }
    }

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
