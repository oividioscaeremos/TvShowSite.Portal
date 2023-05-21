import { BaseResponse, BaseResponseWithEntity } from "../common/base-response.model";

export class UserShowHomeEntity 
{
    ShowId: number;
    EpisodeId: number;
    Name: string;
    PosterURL: string;
    SeasonNumber: number;
    EpisodeNumber: number;
}

export class GetUserNextToWatchResponse extends BaseResponseWithEntity<Array<UserShowHomeEntity>>
{
    
}