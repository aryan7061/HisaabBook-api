import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('AuthResponse')
export class AuthResponse {
  @Field()
  accessToken!: string;
}
