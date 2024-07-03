import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './entity/like.entity';
import { LikeRepository } from './like.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  providers: [LikeRepository],
  exports: [LikeRepository],
})
export class LikeModule {}
