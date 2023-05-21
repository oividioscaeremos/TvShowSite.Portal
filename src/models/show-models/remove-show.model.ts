import { BaseResponse } from "../common/base-response.model";

export class RemoveShowRequest
{
    Id: number;

    constructor(id: number)
    {
        this.Id = id;
    }
}

export class RemoveShowResponse extends BaseResponse
{
    
}