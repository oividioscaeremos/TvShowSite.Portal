import { BaseResponseWithEntity } from "../common/base-response.model";

export class GetLatestCommentsResponseEntity
{
    ShowId: number;
    EpisodeId: number;
    ShowName: string;
    SeasonNumber: string;
    EpisodeNumber: string;
    CommentText: string;
    CommentDate: Date;
    Username: string;
}

export class GetLatestCommentsResponse extends BaseResponseWithEntity<Array<GetLatestCommentsResponseEntity>>
{
    
}