import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from './entity/stroy.entity';
import { StoryRepository } from './story.repository';
import { LikeModule } from 'src/like/like.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports : [MongooseModule.forFeature([{name : Story.name, schema : StorySchema}]),LikeModule,AuthModule,UserModule],
  providers: [StoryService, StoryResolver,StoryRepository]
})
export class StoryModule {}
