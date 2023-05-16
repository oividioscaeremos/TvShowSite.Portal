import { BaseResponseWithEntity } from "../common/base-response.model";
import { LoginResponseEntity } from "./login-models.model";

export class RefreshTokenRequest
{
    RefreshToken: string | undefined;
}

export class RefreshTokenResponse extends BaseResponseWithEntity<LoginResponseEntity>
{
    
}