import { ObjectType, InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

// Names match schema.types.ts exactly: object type is `CheckListItem`,
// input type is `ChecklistItemInput` — deliberate casing kept as-is.
@ObjectType('CheckListItem')
export class CheckListItem {
  @Field()
  title!: string;

  @Field()
  checked!: boolean;
}

@InputType('ChecklistItemInput')
export class ChecklistItemInput {
  @Field()
  @IsString()
  title!: string;

  @Field()
  @IsBoolean()
  checked!: boolean;
}
