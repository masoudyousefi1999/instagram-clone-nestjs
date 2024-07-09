import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StoryRepository } from './story.repository';
import { AddStoryInput } from './input/addStory.input';
import { LikeService } from 'src/like/like.service';
import { Types } from 'mongoose';

@Injectable()
export class StoryService {
  constructor(
    @Inject(StoryRepository) private readonly storyRepository: StoryRepository,
    @Inject(LikeService) private readonly likeService: LikeService,
  ) {}

  async deleteStory(storyId: Types.ObjectId, userId: Types.ObjectId) {
    await this.likeService.deleteLikes({ parentId: storyId });
    const deletedStory = await this.storyRepository.deleteDocument({
      _id: storyId,
      userId: userId,
    });
    return deletedStory;
  }
  async addStory(addStoryInput: AddStoryInput) {
    const newStory = await this.storyRepository.createDocument(addStoryInput);
    const deleteStoryTime = 1000 * 60 * 10;
    // delete story after certain time
    setTimeout(async () => {
      console.log(
        `story with content : ${newStory.content} deleted successfully.`,
      );
      this.deleteStory(newStory._id, addStoryInput.userId);
    }, deleteStoryTime);

    return newStory;
  }

  async LikeStory(storyId: Types.ObjectId, userId: Types.ObjectId) {
    const currentStory = await this.storyRepository.findOneStory({
      _id: storyId,
    });
    console.log(currentStory);
    const isUserLikeStoryBefore = currentStory.likes.findIndex(
      (like) => like.userId.toString() === userId.toString(),
    );
    if (!(isUserLikeStoryBefore === -1)) {
      throw new UnprocessableEntityException('you like this post before!.');
    }
    const like = await this.likeService.addLike(storyId, userId);
    await this.storyRepository.updateStory(
      { _id: storyId },
      { $push: { likes: like._id } },
    );
    return 'post liked successfully.';
  }

  async dislikeStory(storyId: Types.ObjectId, userId: Types.ObjectId) {
    const currentStory = await this.storyRepository.findOneStory({
      _id: storyId,
    });
    const filtredLikes = currentStory.likes.filter(
      (like) => like.userId.toString() !== userId.toString(),
    );
    if (!(filtredLikes.length === filtredLikes.length)) {
      throw new UnprocessableEntityException(
        "user didn't like this post before!.",
      );
    }
    await this.likeService.deleteLike(storyId, userId);
    await this.storyRepository.updateStory(
      { _id: storyId },
      { likes: filtredLikes },
    );
    return 'post disliked successfully';
  }
}
