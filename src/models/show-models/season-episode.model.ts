import { BaseResponseWithEntity } from "../common/base-response.model";

export class SeasonEpisodeResponseEntity
{
    ShowId: number;
    SeasonId: number;
    EpisodeId: number;
    SeasonName: string;
    EpisodeNumber: string;
    EpisodeName: string;
    IsWatched: boolean;
}

export class SeasonEpisodeResponse extends BaseResponseWithEntity<Array<SeasonEpisodeResponseEntity>>
{

}

export class SeasonEpisodeSeason
{
    SeasonId: number;
    SeasonName: string;
    Episodes: Array<SeasonEpisodeEpisode>;
}

export class SeasonEpisodeEpisode
{
    SeasonId: number;
    EpisodeId: number;
    EpisodeNumber: string;
    EpisodeName: string;
    IsWatched: boolean;
}