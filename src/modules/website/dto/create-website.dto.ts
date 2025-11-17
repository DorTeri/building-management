import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateWebsiteDto {
  @IsInt({ message: 'Publisher ID must be an integer' })
  @Min(1, { message: 'Publisher ID must be a positive integer' })
  publisher_id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name: string;
}
