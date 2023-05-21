import { BaseResponse } from "../common/base-response.model";

export class AddShowRequest
{
    Id: number;
    TheMovieDbId: number;

    constructor(id: number, theMovieDbId: number)
    {
        this.Id = id;
        this.TheMovieDbId = theMovieDbId;
    }
}

export class AddShowResponse extends BaseResponse
{
    
}