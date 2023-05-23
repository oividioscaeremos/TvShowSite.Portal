import { BaseResponse } from "../common/base-response.model";

export class AddVoteRequest
{
    EpisodeId: number;
    CharacterId: number;

    constructor(episodeId: number, characterId: number)
    {
        this.EpisodeId = episodeId;
        this.CharacterId = characterId;
    }
}

export class AddVoteResponse extends BaseResponse
{
    
}