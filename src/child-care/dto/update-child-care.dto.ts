import { PartialType } from '@nestjs/mapped-types';

import { CreateChildCareDto } from './create-child-care.dto';

export class UpdateChildCareDto extends PartialType(CreateChildCareDto) {}
