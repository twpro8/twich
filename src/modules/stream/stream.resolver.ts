import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StreamService } from './stream.service';
import { StreamModel } from '@/src/modules/stream/models/stream.model';
import { FiltersInput } from '@/src/modules/stream/inputs/filters.input';
import { ChangeStreamInfoInput } from '@/src/modules/stream/inputs/change-stream-info.input';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@prisma/generated/client';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { type FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe';
import { GenerateStreamTokenModel } from '@/src/modules/stream/models/generate-token.model';
import { GenerateStreamTokenInput } from '@/src/modules/stream/inputs/generate-stream-token.input';

@Resolver('Stream')
export class StreamResolver {
  constructor(private readonly streamService: StreamService) {}

  @Query(() => [StreamModel])
  async findAllStreams(@Args('filters') input: FiltersInput) {
    return this.streamService.findAll(input);
  }

  @Query(() => [StreamModel])
  async findRandomStreams() {
    return this.streamService.findRandomStreams();
  }

  @Authorization()
  @Mutation(() => Boolean)
  async changeStreamInfo(
    @Authorized() user: User,
    @Args('data') input: ChangeStreamInfoInput,
  ) {
    return this.streamService.changeStreamInfo(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async changeStreamThumbnail(
    @Authorized() user: User,
    @Args({ name: 'thumbnail', type: () => GraphQLUpload }, FileValidationPipe)
    thumbnail: Promise<FileUpload>,
  ) {
    return this.streamService.changeThumbnail(user, thumbnail);
  }

  @Authorization()
  @Mutation(() => Boolean)
  async removeStreamThumbnail(@Authorized() user: User) {
    return this.streamService.removeThumbnail(user);
  }

  @Mutation(() => GenerateStreamTokenModel)
  async generateStreamToken(@Args('data') input: GenerateStreamTokenInput) {
    return this.streamService.generateStreamToken(input);
  }
}
