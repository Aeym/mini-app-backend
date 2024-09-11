import { IsNotEmpty } from 'class-validator';

export class GetUserDto {
  @IsNotEmpty({ message: 'Username is required' })
  username: string;
}
