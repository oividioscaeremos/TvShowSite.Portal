import { BaseResponseWithEntity } from "../common/base-response.model";

export class FavoriteCharactersResponseEntity
{
    CharacterId: number;
    CharacterName: string;
    VoteCount: number;
    PosterURL: string;
    IsUsersVote: boolean;
}

export class FavoriteCharactersResponse extends BaseResponseWithEntity<Array<FavoriteCharactersResponseEntity>>
{
    
}