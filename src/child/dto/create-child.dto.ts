import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateChildDto {
  @IsNotEmpty({ message: 'Firstname is required' })
  firstname: string;

  @IsNotEmpty({ message: 'Lastname is required' })
  lastname: string;

  @IsInt({ message: 'Child care ID must be an integer' })
  @IsNotEmpty({ message: 'Child care ID is required' })
  childCareId: number;
}
