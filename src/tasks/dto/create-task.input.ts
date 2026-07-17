import { InputType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ChecklistItemInput } from '../checklist-item.object';

@InputType('CreateTaskInput')
export class CreateTaskInput {
  @Field()
  @IsString()
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  stageId?: string;

  @Field(() => [ChecklistItemInput], { nullable: true })
  @IsOptional()
  @IsArray()
  checklist?: ChecklistItemInput[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  userIds?: string[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  contactIds?: string[];
}
