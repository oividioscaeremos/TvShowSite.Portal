import { BaseResponseWithEntity } from "../common/base-response.model";

export class GetCommentsRequest
{
    ShowId: number;
    EpisodeId?: number;
    PageIndex?: number;
    PageSize: number;

    constructor(showId: number, pageSize: number, pageIndex?: number, episodeId?: number)
    {
        console.log("ilker get comments request constructor", {showId, pageSize,pageIndex,episodeId})
        this.ShowId = showId;
        this.EpisodeId = episodeId;
        this.PageIndex = pageIndex;
        this.PageSize = pageSize;
    }
}

export class GetCommentsResponseEntity
{
    Id: number;
    CommentText: string;
    UserId: number;
    UserName: string;
    UserProfilePicture: string | null;
    IsUsersComment: boolean;
    CommentDate: Date;
}

export class GetCommentsResponse extends BaseResponseWithEntity<Array<GetCommentsResponseEntity>>
{

}