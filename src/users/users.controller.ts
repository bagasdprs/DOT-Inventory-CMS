import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Redirect,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. LIST USER (Table)
  @Get()
  @Render('users/index')
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      users,
      title: 'User Management',
      path: '/users',
    };
  }

  // 2. FORM CREATE
  @Get('create')
  @Render('users/form')
  createForm() {
    return {
      title: 'Add New User',
      type: 'create',
      user: null,
      path: '/users',
    };
  }

  // 3. ACTION CREATE
  @Post()
  @Redirect('/users')
  async create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const result = await this.usersService.create(createUserDto);

    req.session.flash = {
      type: 'success',
      title: 'User Ditambahkan',
      message: 'Pengguna baru berhasil dibuat.',
    };

    return result;
  }

  // 4. FORM EDIT
  @Get('edit/:id')
  @Render('users/form')
  async editForm(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return {
      title: 'Edit User',
      type: 'edit',
      user: user,
      path: '/users',
    };
  }

  // 5. ACTION UPDATE
  @Post('update/:id')
  @Redirect('/users')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    const result = await this.usersService.update(+id, updateUserDto);

    req.session.flash = {
      type: 'success',
      title: 'User Diupdate',
      message: 'Data pengguna berhasil diperbarui.',
    };

    return result;
  }

  // 6. ACTION DELETE
  @Get('delete/:id')
  @Redirect('/users')
  async remove(@Param('id') id: string, @Req() req: any) {
    const result = await this.usersService.remove(+id);

    req.session.flash = {
      type: 'success',
      title: 'User Dihapus',
      message: 'Pengguna berhasil dihapus.',
    };

    return result;
  }
}
