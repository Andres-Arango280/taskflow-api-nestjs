import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Proyecto, ProyectoSchema } from './schemas/proyecto.schema';
import { Equipo, EquipoSchema } from '../equipos/schemas/equipo.schema';
import { Lista, ListaSchema } from '../listas/schemas/lista.schema';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Proyecto.name, schema: ProyectoSchema },
      { name: Equipo.name, schema: EquipoSchema },
      { name: Lista.name, schema: ListaSchema },
    ]),
  ],
  controllers: [ProyectosController],
  providers: [ProyectosService],
})
export class ProyectosModule {}