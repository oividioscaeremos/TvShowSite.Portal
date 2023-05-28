import { BaseResponse, BaseResponseWithEntity } from "../common/base-response.model";

export class AddShowRequest
{
    Id: number;
    TheMovieDbId: number;
    AddToShows: boolean;

    constructor(id: number, theMovieDbId: number, addToShows: boolean)
    {
        this.Id = id;
        this.TheMovieDbId = theMovieDbId;
        this.AddToShows = addToShows;
    }
}

export class AddShowResponse extends BaseResponseWithEntity<number>
{
    
}