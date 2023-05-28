import { BaseResponseWithEntity } from "../common/base-response.model";

export class AddEpisodeNoteRequest
{
    EpisodeId: number;
    Content: string;

    constructor(episodeId: number, content: string)
    {
        this.EpisodeId = episodeId;
        this.Content = content;
    }
}

export class AddEpisodeNoteResponseEntity
{
    Id: number;
    UserId: number;
    EpisodeId: number;
    Content: string;
}

export class AddEpisodeNoteResponse extends BaseResponseWithEntity<AddEpisodeNoteResponseEntity>
{

}