import { BaseResponse } from "../common/base-response.model";

export class ChangeMailAddressRequest
{
    EmailAddress: string;

    constructor(emailAddress: string)
    {
        this.EmailAddress = emailAddress;
    }
}

export class ChangeMailAddressResponse extends BaseResponse
{
    
}