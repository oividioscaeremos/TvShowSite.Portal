import { BaseResponseWithEntity } from "../common/base-response.model";

export class GetShowNotesShowEntity
{
    ShowId: number;
    ShowName: string;
    Notes: Array<GetShowNotesNoteEntity>
}

export class GetShowNotesNoteEntity
{
    SeasonNumber: number;
    EpisodeNumber: number;
    EpisodeId: number;
    NoteContent: string;
}

export class GetShowNotesResponse extends BaseResponseWithEntity<Array<GetShowNotesShowEntity>>
{
    
}