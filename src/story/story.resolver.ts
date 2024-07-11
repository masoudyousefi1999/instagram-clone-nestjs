import { Inject, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { StoryService } from './story.service';
import { AddStoryInput } from './input/addStory.input';
import { LoginAuthGuard } from 'src/auth/guards/login.guard';
import { StoryType } from './type/story.type';
import { ID } from '@nestjs/graphql';
import { Types } from 'mongoose';

@Resolver((of) => StoryType)
export class StoryResolver {
  constructor(
    @Inject(StoryService) private readonly storyService: StoryService,
  ) {}

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => StoryType)
  async addStory(
    @Args('addStoryInput') addStoryInput: AddStoryInput,
    @Context() ctx,
  ) {
    addStoryInput.userId = ctx.req.user._id;
    return this.storyService.addStory(addStoryInput);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => StoryType)
  async deleteStory(@Args('storyId') storyId: string, @Context() ctx) {
    const userId = ctx.req.user._id;
    const storyObjId = new Types.ObjectId(storyId);
    return this.storyService.deleteStory(storyObjId, userId);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => String)
  async likeStory(@Args('storyId') storyId: string, @Context() ctx) {
    const userId = ctx.req.user._id;
    const storyObjId = new Types.ObjectId(storyId);
    return this.storyService.LikeStory(storyObjId, userId);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => String)
  async disLikeStory(@Args('storyId') storyId: string, @Context() ctx) {
    const userId = ctx.req.user._id;
    const storyObjId = new Types.ObjectId(storyId);
    return this.storyService.dislikeStory(storyObjId, userId);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => StoryType)
  async getAllStories(@Context() ctx) {
    const userId = ctx.req.user._id;
    return this.storyService.getAllStories(userId);
  }

  @UseGuards(LoginAuthGuard)
  @Mutation((returns) => StoryType)
  async getStory(@Args('storyId') storyId: string, @Context() ctx) {
    const userId = ctx.req.user._id;
    const storyObjId = new Types.ObjectId(storyId);
    return this.storyService.getStory(storyObjId, userId);
  }
}
