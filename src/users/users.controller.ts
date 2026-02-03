import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Redirect,
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
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // 6. ACTION DELETE
  @Get('delete/:id')
  @Redirect('/users')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
