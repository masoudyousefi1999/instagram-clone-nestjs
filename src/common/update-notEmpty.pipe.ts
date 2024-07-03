import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class NotEmptyUpdateQuery implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (Object.keys(value).length === 0) {
      throw new BadRequestException('update query should not empty.');
    }
    return value;
  }
}
