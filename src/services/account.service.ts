import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { RegisterRequest, RegisterResponse } from 'src/models/authorization-models/registers-models.model';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from 'src/models/authorization-models/login-models.model';
import { RefreshTokenRequest, RefreshTokenResponse } from 'src/models/authorization-models/refresh-token-models.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpService: HttpService) { }

  public register(request: RegisterRequest) : Promise<RegisterResponse>
  {
    return this.httpService.postWithApiUrl('account/register/', request);
  }

  public login(request: LoginRequest) : Promise<LoginResponse>
  {
    return this.httpService.postWithApiUrl('account/login/', request);
  }

  public refresh(request: RefreshTokenRequest) : Promise<RefreshTokenResponse>
  {
    return this.httpService.postWithApiUrl('account/refresh_token', request);
  }

  public logout() : Promise<any>
  {
    return this.httpService.deleteWithApiUrl('account/logout', {});
  }
}
