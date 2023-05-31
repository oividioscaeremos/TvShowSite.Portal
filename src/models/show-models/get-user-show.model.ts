import { BaseResponseWithEntity } from "../common/base-response.model";

export class GetUserShowResponseEntity
{
    ShowId: number;
    ShowName: string;
    PosterUrl: string;
}

export class GetUserShowResponse extends BaseResponseWithEntity<Array<GetUserShowResponseEntity>>
{

}