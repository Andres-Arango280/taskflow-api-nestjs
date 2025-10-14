import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = new this.usuarioModel({ ...dto, password: hashed });
    await user.save();
    return { message: 'Usuario creado' };
  }

  async login(dto: LoginDto) {
    const user = await this.usuarioModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');
    const token = this.jwtService.sign({ id: user._id }); 
    return { access_token: token };
  }
}