import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Equipo, EquipoSchema } from './schemas/equipo.schema';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema';
import { EquiposController } from './equipos.controller';
import { EquiposService } from './equipos.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipo.name, schema: EquipoSchema },
      { name: Usuario.name, schema: UsuarioSchema },
    ]),
  ],
  controllers: [EquiposController],
  providers: [EquiposService],
})
export class EquiposModule {}