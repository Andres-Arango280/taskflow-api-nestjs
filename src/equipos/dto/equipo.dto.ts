import { IsNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateEquipoDto {
  @IsNotEmpty()
  nombre: string;
}

export class AddMiembroDto {
  @IsString()
  userId: string;
}