export class BaseResponse
{
    ErrorList: string[];
    WarningList: string[];
    Status: Boolean;
}

export class BaseResponseWithEntity<T>
{
    Value: T;
    ErrorList: string[];
    WarningList: string[];
    Status: Boolean;
}