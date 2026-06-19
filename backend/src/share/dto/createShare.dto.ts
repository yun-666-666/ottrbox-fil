import { Type } from "class-transformer";
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { ShareSecurityDTO } from "./shareSecurity.dto";

export class CreateShareDTO {
  @IsString()
  @Matches("^[a-zA-Z0-9_-]*$", undefined, {
    message: "ID can only contain letters, numbers, underscores and hyphens",
  })
  @Length(3, 50)
  id: string;

  @Length(3, 30)
  @IsOptional()
  name: string;

  @IsString()
  expiration: string;

  @MaxLength(512)
  @IsOptional()
  description: string;

  @IsString()
  @MaxLength(20000)
  @IsOptional()
  text?: string;

  @IsEmail({}, { each: true })
  recipients: string[];

  @ValidateNested()
  @Type(() => ShareSecurityDTO)
  security: ShareSecurityDTO;
}
