import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/proyecto.dto';

@Controller('proyectos')
@UseGuards(JwtAuthGuard)
export class ProyectosController {
  constructor(private proyectosService: ProyectosService) {}

  @Post()
  create(@Body() dto: CreateProyectoDto, @Req() req) {
    return this.proyectosService.crearProyecto(dto, req.user.id);

  }
}