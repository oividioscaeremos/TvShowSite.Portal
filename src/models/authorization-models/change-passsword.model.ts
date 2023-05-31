import { BaseResponse } from "../common/base-response.model";

export class ChangePasswordRequest
{
    Password: string;

    constructor(password: string)
    {
        this.Password = password;
    }
}

export class ChangePasswordResponse extends BaseResponse
{
    
}