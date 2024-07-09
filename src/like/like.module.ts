import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './entity/like.entity';
import { LikeRepository } from './like.repository';
import { LikeService } from './like.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  providers: [LikeRepository,LikeService],
  exports: [LikeRepository,LikeService],
})
export class LikeModule {}
