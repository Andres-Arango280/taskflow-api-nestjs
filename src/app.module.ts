import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EquiposModule } from './equipos/equipos.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { ListasModule } from './listas/listas.module';
import { TareasModule } from './tareas/tareas.module';
import { ComentariosModule } from './comentarios/comentarios.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UsuariosModule,
    EquiposModule,
    ProyectosModule,
    ListasModule,
    TareasModule,
    ComentariosModule,
  ],
})
export class AppModule {}