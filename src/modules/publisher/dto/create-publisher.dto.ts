import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePublisherDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  contact_name: string;
}
