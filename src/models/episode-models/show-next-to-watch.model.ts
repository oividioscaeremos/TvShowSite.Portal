import { BaseResponseWithEntity } from "../common/base-response.model";

export class ShowNextToWatchResponseEntity
{
    SeasonId: number;
    EpisodeId: number;
    SeasonNumber: number;
    EpisodeNumber: number;
}

export class ShowNextToWatchResponse extends BaseResponseWithEntity<ShowNextToWatchResponseEntity>
{
    
}