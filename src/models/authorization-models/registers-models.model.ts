import { BaseResponse } from "../common/base-response.model";

export class RegisterRequest 
{
    Username: string | undefined;
    EmailAddress: string | undefined;
    Password: string | undefined;
}

export class RegisterResponse extends BaseResponse
{

}