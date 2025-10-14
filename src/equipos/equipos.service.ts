import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Equipo } from './schemas/equipo.schema';
import { Usuario } from '../usuarios/schemas/usuario.schema';

@Injectable()
export class EquiposService {
  constructor(
    @InjectModel(Equipo.name) private equipoModel: Model<Equipo>,
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async create(dto: any, userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const equipo = new this.equipoModel({
      ...dto,
      lider: userObjectId,
      miembros: [userObjectId],
    });
    return equipo.save();
  }

  async addMiembro(equipoId: string, userId: string, leaderId: string) {
    const equipo = await this.equipoModel.findById(equipoId);
    if (!equipo) throw new NotFoundException('Equipo no encontrado');

    const leaderObjectId = new Types.ObjectId(leaderId);
    const userObjectId = new Types.ObjectId(userId);

    if (!equipo.lider.equals(leaderObjectId))
      throw new ForbiddenException('Solo el líder puede agregar miembros');

    if (!equipo.miembros.some(m => m.equals(userObjectId))) {
      equipo.miembros.push(userObjectId);
      await equipo.save();
    }

    return { message: 'Miembro añadido' };
  }

  async removeMiembro(equipoId: string, userId: string, leaderId: string) {
  const equipo = await this.equipoModel.findById(equipoId);
  if (!equipo) throw new NotFoundException('Equipo no encontrado');

  if (equipo.lider.toString() !== leaderId) {
    throw new ForbiddenException('Solo el líder puede eliminar miembros');
  }


  if (equipo.lider.toString() === userId) {
    throw new BadRequestException('No se puede eliminar al líder');
  }

  equipo.miembros = equipo.miembros.filter(
    (miembro) => miembro.toString() !== userId,
  );

  await equipo.save();
  return { message: 'Miembro eliminado correctamente', equipo };
}

}
