import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TareasService } from './tareas.service';
import { AsignarMiembrosDto, CreateTareaDto, MoverTareaDto } from './dto/tarea.dto';



@Controller('tareas')
@UseGuards(JwtAuthGuard)
export class TareasController {
  constructor(private tareasService: TareasService) {}

  @Post()
  create(@Body() dto: CreateTareaDto, @Req() req) {
    return this.tareasService.create(dto, req.user.id);
  }

  @Patch(':id/mover')
  mover(@Param('id') id: string, @Body() dto: MoverTareaDto, @Req() req) {
    return this.tareasService.moverTarea(id, dto.nuevaListaId, req.user.id);
  }
  @Patch(':id/asignar')
    @UseGuards(JwtAuthGuard)
    asignarMiembros(@Param('id') id: string, @Body() dto: AsignarMiembrosDto, @Req() req) {
    return this.tareasService.asignarMiembros(id, dto.miembros, req.user.id);
    }

}