import { BaseResponse } from "../common/base-response.model";

export class RemoveVoteRequest
{
    EpisodeId: number;

    constructor(episodeId: number)
    {
        this.EpisodeId = episodeId;
    }
}

export class RemoveVoteResponse extends BaseResponse
{

}