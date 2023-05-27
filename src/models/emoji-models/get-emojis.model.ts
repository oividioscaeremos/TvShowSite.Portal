import { BaseResponseWithEntity } from "../common/base-response.model";

export class GetEmojisResponseEntity 
{
    Id: number;
    EmojiClass: string;
}

export class GetEmojisResponse extends BaseResponseWithEntity<Array<GetEmojisResponseEntity>>
{

}