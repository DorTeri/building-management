import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateWebsiteDto {
  @IsInt()
  publisher_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
