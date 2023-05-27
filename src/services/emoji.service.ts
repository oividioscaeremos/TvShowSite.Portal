import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { GetEmojisResponse } from 'src/models/emoji-models/get-emojis.model';
import { AddReactionRequest, AddReactionResponse } from 'src/models/emoji-models/add-reaction.model';
import { GetCommentReactionsResponse } from 'src/models/emoji-models/get-comment-reactions.model';
import { GetEpisodeReactionsResponse } from 'src/models/emoji-models/get-episode-reactions.model';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {

  constructor(private httpService: HttpService) { }

  public getEmojis(isComment: boolean) : Promise<GetEmojisResponse>
  {
    return this.httpService.getWithApiUrl('emoji/get_emojis', { isComment: isComment });
  }

  public getCommentReactions(commentId: number) : Promise<GetCommentReactionsResponse>
  {
    return this.httpService.getWithApiUrl('emoji/get_comment_reactions', { commentId: commentId });
  }

  public getEpisodeReactions(episodeId: number) : Promise<GetEpisodeReactionsResponse>
  {
    return this.httpService.getWithApiUrl('emoji/get_episode_reactions', { episodeId: episodeId });
  }

  public addReaction(request: AddReactionRequest) : Promise<AddReactionResponse>
  {
    return this.httpService.postWithApiUrl('emoji/add_reaction', request);
  }
}
