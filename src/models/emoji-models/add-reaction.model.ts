import { BaseResponse } from "../common/base-response.model";

export class AddReactionRequest
{
    EpisodeId?: number;
    CommentId?: number;
    EmojiId: number;
    
    constructor(emojiId: number, episodeId?: number, commentId?: number)
    {
        this.EmojiId = emojiId;
        this.EpisodeId = episodeId;
        this.CommentId = commentId;
    }
}

export class AddReactionResponse extends BaseResponse
{

}