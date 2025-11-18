import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
  MaxLength,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class CreateWebsiteDto {
  @IsOptional()
  @IsInt({ message: 'ID must be an integer' })
  @Min(1, { message: 'ID must be a positive integer' })
  id?: number;

  @ValidateIf((o: CreateWebsiteDto) => !o.id)
  @IsInt({ message: 'Publisher ID must be an integer' })
  @Min(1, { message: 'Publisher ID must be a positive integer' })
  @IsNotEmpty({
    message: 'Publisher ID is required when creating a new website',
  })
  publisher_id?: number;

  @ValidateIf((o: CreateWebsiteDto) => !o.id)
  @IsString()
  @IsNotEmpty({ message: 'Name is required when creating a new website' })
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name?: string;
}
