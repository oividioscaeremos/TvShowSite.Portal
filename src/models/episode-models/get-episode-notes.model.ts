import { BaseResponseWithEntity } from "../common/base-response.model";

export class GetEpisodeNotesResponseEntity
{
    Id: number;
    UserId: number;
    EpisodeId: number;
    Content: string;
}

export class GetEpisodeNotesResponse extends BaseResponseWithEntity<Array<GetEpisodeNotesResponseEntity>>
{

}