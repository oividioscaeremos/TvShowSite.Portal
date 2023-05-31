import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { RegisterRequest, RegisterResponse } from 'src/models/authorization-models/registers-models.model';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from 'src/models/authorization-models/login-models.model';
import { RefreshTokenRequest, RefreshTokenResponse } from 'src/models/authorization-models/refresh-token-models.model';
import { UploadFileResponse } from 'src/models/authorization-models/upload-file.model';
import { ChangeUserPictureRequest, ChangeUserPictureResponse } from 'src/models/authorization-models/change-user-picture.model';
import { ChangeMailAddressRequest, ChangeMailAddressResponse } from 'src/models/authorization-models/change-mail.model';
import { ChangePasswordRequest, ChangePasswordResponse } from 'src/models/authorization-models/change-passsword.model';
import { GetUserProfileDetailRequest, GetUserProfileDetailResponse } from 'src/models/authorization-models/get-profile-detail.model';

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

  public uploadFile(file: File) : Promise<UploadFileResponse>
  {
    return this.httpService.uploadFile('account/upload_file', file);
  }
  
  public changeUserPicture(request: ChangeUserPictureRequest) : Promise<ChangeUserPictureResponse>
  {
    return this.httpService.postWithApiUrl('account/change_user_picture', request);
  }

  public changeMail(request: ChangeMailAddressRequest) : Promise<ChangeMailAddressResponse>
  {
    return this.httpService.postWithApiUrl('account/change_mail', request);
  }

  public changePassword(request: ChangePasswordRequest) : Promise<ChangePasswordResponse>
  {
    return this.httpService.postWithApiUrl('account/change_password', request);
  }

  public getUserProfileDetail(request: GetUserProfileDetailRequest) : Promise<GetUserProfileDetailResponse>
  {
    return this.httpService.postWithApiUrl('account/get_user_profile_detail', request);
  }
}
