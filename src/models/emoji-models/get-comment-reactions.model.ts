import { BaseResponseWithEntity } from "../common/base-response.model";

export class GetCommentReactionsResponseEntity
{
    EmojiId: number;
    ReactionCount: number;
    IsUsersReaction: boolean;
    EmojiClassName: string;
}

export class GetCommentReactionsResponse extends BaseResponseWithEntity<Array<GetCommentReactionsResponseEntity>>
{

}