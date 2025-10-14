import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tarea } from './schemas/tarea.schema';
import { Proyecto } from '../proyectos/schemas/proyecto.schema';
import { Equipo } from '../equipos/schemas/equipo.schema';
import { Lista } from '../listas/schemas/lista.schema';

@Injectable()
export class TareasService {
  constructor(
    @InjectModel(Tarea.name) private tareaModel: Model<Tarea>,
    @InjectModel(Proyecto.name) private proyectoModel: Model<Proyecto>,
    @InjectModel(Equipo.name) private equipoModel: Model<Equipo>,
    @InjectModel(Lista.name) private listaModel: Model<Lista>,
  ) {}

  
  async create(dto: any, userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const proyecto = await this.proyectoModel.findById(dto.proyectoId).populate('equipo');
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');

    const equipo = await this.equipoModel.findById(proyecto.equipo);
    if (!equipo) throw new NotFoundException('Equipo asociado no encontrado');

    if (!equipo.miembros.some(m => m.equals(userObjectId)))
      throw new ForbiddenException('No perteneces al equipo');

    
    for (const asignadoId of dto.asignados || []) {
      if (!equipo.miembros.some(m => m.equals(new Types.ObjectId(asignadoId))))
        throw new ForbiddenException('Usuario asignado no pertenece al equipo');
    }

    const primeraLista = await this.listaModel.findOne({ proyecto: proyecto._id });
    if (!primeraLista) throw new NotFoundException('Lista no encontrada');

    const tarea = new this.tareaModel({
      ...dto,
      lista: primeraLista._id,
    });

    return tarea.save();
  }

  
  async moverTarea(tareaId: string, nuevaListaId: string, userId: string) {
    const tarea = await this.tareaModel.findById(tareaId).populate({
      path: 'lista',
      populate: { path: 'proyecto' },
    });
    if (!tarea) throw new NotFoundException('Tarea no encontrada');

    const lista = tarea.lista as unknown as { proyecto: Types.ObjectId };
    const proyecto = await this.proyectoModel.findById(lista.proyecto).populate('equipo');
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');

    const equipo = await this.equipoModel.findById(proyecto.equipo);
    if (!equipo) throw new NotFoundException('Equipo no encontrado');

    if (!equipo.miembros.some(m => m.equals(new Types.ObjectId(userId))))
      throw new ForbiddenException('No perteneces al equipo');

    const nuevaLista = await this.listaModel.findById(nuevaListaId);
    if (!nuevaLista || nuevaLista.proyecto.toString() !== proyecto._id.toString())
      throw new NotFoundException('Lista destino inválida');

    tarea.lista = nuevaLista._id;
    return tarea.save();
  }

  
  async asignarMiembros(tareaId: string, miembrosIds: string[], userId: string) {
    const tarea = await this.tareaModel.findById(tareaId).populate({
      path: 'lista',
      populate: { path: 'proyecto' },
    });
    if (!tarea) throw new NotFoundException('Tarea no encontrada');

    const lista = tarea.lista as unknown as { proyecto: Types.ObjectId };
    const proyecto = await this.proyectoModel.findById(lista.proyecto).populate('equipo');
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');

    const equipo = await this.equipoModel.findById(proyecto.equipo);
    if (!equipo.miembros.some(m => m.equals(new Types.ObjectId(userId))))
      throw new ForbiddenException('No perteneces al equipo');

    
    const miembrosValidos = miembrosIds.filter(id =>
      equipo.miembros.some(m => m.equals(new Types.ObjectId(id))),
    );

    
    tarea.asignados = [
      ...new Set([
        ...tarea.asignados.map(id => id.toString()),
        ...miembrosValidos,
      ]),
    ].map(id => new Types.ObjectId(id));

    return tarea.save();
  }
}
