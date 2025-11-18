import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreatePublisherDto {
  @IsOptional()
  @IsInt({ message: 'ID must be an integer' })
  @Min(1, { message: 'ID must be a positive integer' })
  id?: number;

  @ValidateIf((o: CreatePublisherDto) => !o.id)
  @IsString()
  @IsNotEmpty({ message: 'Name is required when creating a new publisher' })
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name?: string;

  @ValidateIf((o: CreatePublisherDto) => !o.id)
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required when creating a new publisher' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email?: string;

  @ValidateIf((o: CreatePublisherDto) => !o.id)
  @IsString()
  @IsNotEmpty({
    message: 'Contact name is required when creating a new publisher',
  })
  @MinLength(1, { message: 'Contact name must be at least 1 character long' })
  @MaxLength(255, { message: 'Contact name must not exceed 255 characters' })
  contact_name?: string;
}
