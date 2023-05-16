import { BaseResponseWithEntity } from "../common/base-response.model";

export class ShowSearchRequest
{
    Name: string;
    Page: number;
    PageSize: number;
}

export class ShowSearchResponseEntity
{
    Id: number;
    MovieDbId: number;
    ShowName: string;
    PosterURL: string;
    EpisodeCount: number;
    SeasonCount: number;
}

export class ShowSearchResponse extends BaseResponseWithEntity<Array<ShowSearchResponseEntity>>
{
    TotalResults: number;
    TotalPages: number;
}