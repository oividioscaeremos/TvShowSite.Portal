import { BaseResponse, BaseResponseWithEntity } from "../common/base-response.model";

export class LoginRequest
{
    Username: string | undefined;
    Password: string | undefined;    
}

export class LoginResponseEntity
{
    AccessToken: string | undefined;
    RefreshToken: string | undefined;
}

export class LoginResponse extends BaseResponseWithEntity<LoginResponseEntity>
{

}