import { BaseResponse } from "../common/base-response.model";

export class UpdateEpisodeNoteRequest
{
    NoteId: number;
    NewContent: string;

    constructor(noteId: number, newContent: string)
    {
        this.NoteId = noteId;
        this.NewContent = newContent;
    }
}

export class UpdateEpisodeNoteResponse extends BaseResponse
{
    
}