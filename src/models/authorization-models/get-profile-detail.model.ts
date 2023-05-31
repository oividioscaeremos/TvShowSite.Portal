import { BaseResponseWithEntity } from "../common/base-response.model";

export class GetUserProfileDetailRequest
{
    UserId?: number;

    constructor(userId?: number)
    {
        this.UserId = userId;
    }
}

export class GetUserProfileDetailResponseEntity
{
    IsUsersOwnProfile: boolean;
    CoverPictureUrl: string;
    ProfilePictureUrl: string;
    MailAddress: string;
    Username: string;
}

export class GetUserProfileDetailResponse extends BaseResponseWithEntity<GetUserProfileDetailResponseEntity>
{

}