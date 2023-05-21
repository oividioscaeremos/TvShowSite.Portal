import { BaseResponseWithEntity } from "../common/base-response.model";

export class MarkAsWatchedRequest
{
    ShowId: number;
    EpisodeId: number;

    constructor(showId: number, episodeId: number)
    {
        this.ShowId = showId;
        this.EpisodeId = episodeId;
    }
}

export class MarkAsWatchedResponseEntity
{
    EpisodeId: number;
    SeasonNumber: number;
    EpisodeNumber: number;
    IsFinished: boolean;
}

export class MarkAsWatchedResponse extends BaseResponseWithEntity<MarkAsWatchedResponseEntity>
{
    
}