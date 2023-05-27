import { BaseResponseWithEntity } from "../common/base-response.model";

export class GetEpisodeReactionsResponseEntity
{
    EmojiId: number;
    ReactionCount: number;
    IsUsersReaction: boolean;
}

export class GetEpisodeReactionsResponse extends BaseResponseWithEntity<Array<GetEpisodeReactionsResponseEntity>>
{
    
}