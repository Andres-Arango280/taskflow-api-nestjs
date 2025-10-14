import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Proyecto } from './schemas/proyecto.schema';
import { CreateProyectoDto } from './dto/proyecto.dto';
import { Lista } from '../listas/schemas/lista.schema';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectModel(Proyecto.name) private readonly proyectoModel: Model<Proyecto>,
    @InjectModel(Lista.name) private readonly listaModel: Model<Lista>,
  ) {}

  
  async crearProyecto(createProyectoDto: CreateProyectoDto, userId: string): Promise<Proyecto> {
    const proyecto = new this.proyectoModel({
      ...createProyectoDto,
      creador: userId, 
    });

    const nuevoProyecto = await proyecto.save();

    
    await this.listaModel.insertMany([
      { nombre: 'Por Hacer', proyecto: nuevoProyecto._id },
      { nombre: 'En Progreso', proyecto: nuevoProyecto._id },
      { nombre: 'Hecho', proyecto: nuevoProyecto._id },
    ]);

    return nuevoProyecto;
  }

  
  async obtenerListasPorProyecto(proyectoId: string) {
    
    const objectId = new Types.ObjectId(proyectoId);

    const listas = await this.listaModel.find({ proyecto: objectId }).exec();

    if (!listas.length) {
      throw new NotFoundException('No se encontraron listas para este proyecto');
    }

    return listas;
    }
  }

