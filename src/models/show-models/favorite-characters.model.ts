import { BaseResponseWithEntity } from "../common/base-response.model";

export class FavoriteCharactersResponseEntity
{
    CharacterName: string;
    VoteCount: number;
    PosterURL: string;
}

export class FavoriteCharactersResponse extends BaseResponseWithEntity<Array<FavoriteCharactersResponseEntity>>
{
    
}