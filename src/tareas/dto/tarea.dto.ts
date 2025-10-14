import { IsArray, IsString, IsNotEmpty } from 'class-validator';

export class CreateTareaDto {
  @IsNotEmpty()
  titulo: string;

  descripcion?: string;

  @IsString()
  proyectoId: string;

  @IsArray()
  asignados: string[];
}

export class MoverTareaDto {
  @IsString()
  nuevaListaId: string;
}


export class AsignarMiembrosDto {
  @IsArray()
  @IsString({ each: true })
  miembros: string[];
}
