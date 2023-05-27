import { BaseResponse } from "../common/base-response.model";

export class AddCommentRequest
{
    ShowId: number;
    EpisodeId?: number;
    ParentCommentId?: number;
    Comment: string;

    constructor(comment: string, showId: number, episodeId?:number, parentCommentId?: number)
    {
        this.ShowId = showId;
        this.EpisodeId = episodeId;
        this.ParentCommentId = parentCommentId;
        this.Comment = comment;
    }
}

export class AddCommentResponse extends BaseResponse
{
    
}