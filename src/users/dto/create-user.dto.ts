import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateOrUpdateUserDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Username is required' })
  username: string;
}
