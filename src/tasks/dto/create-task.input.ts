import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDateString,
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

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

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
}
