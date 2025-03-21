import { IsOptional, IsEnum, IsString, IsIn } from 'class-validator';


export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

@IsString()
  @IsOptional()
  @IsIn(['pending', 'completed', 'active'])
  status?: string; 
}