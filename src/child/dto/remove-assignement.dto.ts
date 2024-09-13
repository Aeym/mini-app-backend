import { IsNotEmpty, IsNumberString } from 'class-validator';

export class RemoveAssignementDto {
  @IsNumberString()
  @IsNotEmpty({ message: 'Child ID is required' })
  childId: number;

  @IsNumberString()
  @IsNotEmpty({ message: 'Child care ID is required' })
  childCareId: number;
}
