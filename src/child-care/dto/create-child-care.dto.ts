import { IsNotEmpty } from 'class-validator';

export class CreateChildCareDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
