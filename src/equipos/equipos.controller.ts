import { Controller, Post, Param, Body, Req, UseGuards, Delete } from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddMiembroDto, CreateEquipoDto } from './dto/equipo.dto';

@Controller('equipos')
@UseGuards(JwtAuthGuard)
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {}

  @Post()
  create(@Body() dto: CreateEquipoDto, @Req() req) {
    return this.equiposService.create(dto, req.user.id);
  }

  @Post(':id/miembros')
  addMiembro(@Param('id') id: string, @Body() dto: AddMiembroDto, @Req() req) {
    
    return this.equiposService.addMiembro(id, dto.userId, req.user.id);
  }
  
  @Delete(':id/miembros/:userId')
    removeMiembro(
    @Param('id') equipoId: string,
    @Param('userId') userId: string,
    @Req() req,
    ) {
    return this.equiposService.removeMiembro(equipoId, userId, req.user.id);
    }
}
