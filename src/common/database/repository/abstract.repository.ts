import { AbstractEntity } from '../entity/abstract.entity';
import {
  FilterQuery,
  Model,
  QuerySelector,
  Types,
  UpdateQuery,
} from 'mongoose';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export abstract class AbstractRepository<T extends AbstractEntity> {
  constructor(private readonly model: Model<T>) {}

  async createDocument(document: Omit<T, '_id'>): Promise<T> {
    try {
      const newDocument = await this.model.create({
        _id: new Types.ObjectId(),
        ...document,
      });
      if (!newDocument) {
        throw new InternalServerErrorException(
          'server side error => cant create document',
        );
      }
      return newDocument;
    } catch (error) {
      if (error.code === 11000) {
        // finding duplicated field name
        const duplicatedField = Object.keys(error.keyPattern)[0];
        throw new BadRequestException(
          `duplicate error on field  ${duplicatedField} : please change your ${duplicatedField} and try again`,
        );
      }
      throw new InternalServerErrorException(`server side error => ${error}`);
    }
  }

  async findOndeDocument(
    filterQuery: FilterQuery<T>,
    select?: QuerySelector<T>,
    populate?: string,
  ): Promise<T> {
    try {
      const foundedDocument = await this.model
        .findOne(filterQuery)
        .select(select)
        .populate(populate)
        .lean<T>();
      if (!foundedDocument) {
        throw new NotFoundException(
          `document notfound with query => ${filterQuery}`,
        );
      }

      return foundedDocument;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`server side error => ${error}`);
    }
  }

  async findAllDocuments(
    select?: QuerySelector<T> | undefined | null,
    populate?: string,
  ): Promise<T[]> {
    try {
      const documnets = await this.model
        .find({})
        .sort({createdAt : -1})
        .select(select)
        .populate(populate)
        .lean<T[]>();

      return documnets;
    } catch (error) {
      throw new InternalServerErrorException(`server side error => ${error}`);
    }
  }

  async deleteDocument(
    filterQuery: FilterQuery<T>,
  ): Promise<T> {
    try {
      const deletedDocument = await this.model
        .findOneAndDelete(filterQuery)
        .lean<T>();
      if (!deletedDocument) {
        throw new NotFoundException(
          `document notfound with query => ${filterQuery}`,
        );
      }
      return deletedDocument;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`server side error => ${error}`);
    }
  }

  async updateDocument(
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T>,
    select?: QuerySelector<T> | undefined | null,
    populate?: string,
  ): Promise<T> {
    try {
      const updateDocument = await this.model.findOneAndUpdate(
        filterQuery,
        {
          $set: { ...updateQuery },
        },
        {
          new: true,
        },
      );
      if (!updateDocument) {
        throw new NotFoundException(
          `document notfound with query => ${filterQuery}`,
        );
      }

      return updateDocument;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`server side error => ${error}`);
    }
  }
}
