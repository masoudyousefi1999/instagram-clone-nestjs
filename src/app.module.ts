import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { DataBaseModule } from './common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { LikeModule } from './like/like.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { StoryModule } from './story/story.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    DataBaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'gql-schema.gql'),
        includeStacktraceInErrorResponses:
          configService.getOrThrow<string>('NODE_ENV') === 'dev' ? true : false,
        context: ({ req, res }) => ({ req, res }),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    LikeModule,
    PostModule,
    CommentModule,
    StoryModule,
    ScheduleModule.forRoot()
  ]
})
export class AppModule {}
