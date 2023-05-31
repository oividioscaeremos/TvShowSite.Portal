import { BaseResponse } from "../common/base-response.model";

export class ChangeUserPictureRequest
{
    PictureUrl: string;
    IsCoverPicture: boolean;
    IsProfilePicture: boolean;

    constructor(pictureUrl: string, isCoverPicture: boolean, isProfilePicture: boolean)
    {
        this.PictureUrl = pictureUrl;
        this.IsCoverPicture = isCoverPicture;
        this.IsProfilePicture = isProfilePicture;
    }
}

export class ChangeUserPictureResponse extends BaseResponse
{
    
}