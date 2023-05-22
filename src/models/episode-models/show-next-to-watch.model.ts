import { BaseResponseWithEntity } from "../common/base-response.model";

export class ShowNextToWatchResponseEntity
{
    SeasonNumber: number;
    EpisodeNumber: number;
}

export class ShowNextToWatchResponse extends BaseResponseWithEntity<ShowNextToWatchResponseEntity>
{
    
}