import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreatePublisherDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Contact name must be at least 1 character long' })
  @MaxLength(255, { message: 'Contact name must not exceed 255 characters' })
  contact_name: string;
}
