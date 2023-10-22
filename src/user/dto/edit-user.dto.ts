import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
