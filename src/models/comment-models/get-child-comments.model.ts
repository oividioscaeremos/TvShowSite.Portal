import { GetCommentsResponse } from "./get-comment.model";

export class GetChildCommentsRequest
{
    CommentId: number

    constructor(commentId: number)
    {
        this.CommentId = commentId;
    }
}

export class GetChildCommentsResponse extends GetCommentsResponse
{
    
}