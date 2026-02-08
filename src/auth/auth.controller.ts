import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Render,
  Session,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 1. LOGIN PAGE
  @Get('login')
  @Render('auth/login')
  loginPage(@Session() session: Record<string, any>, @Res() res: Response) {
    if (session && session.user) {
      return res.redirect('/');
    }
    return { layout: false, message: null };
  }

  // 2. LOGIN PROCESSING
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    // USER VALIDATION
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (user) {
      // --- SUCCESS ---
      session.user = user;
      session.flash = {
        type: 'success',
        title: 'Login Berhasil!',
        message: `Selamat datang kembali, ${user.name} 👋`,
      };
      return res.redirect('/');
    } else {
      // --- FAILURE ---
      return res.render('auth/login', {
        layout: false,
        message: 'Invalid Email or Password!',
        oldEmail: loginDto.email,
      });
    }
  }

  @Get('register')
  @Render('auth/register')
  registerPage() {
    return { layout: false };
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      await this.authService.register(registerDto);

      req.session.flash = {
        type: 'success',
        title: 'Registrasi Berhasil',
        message: 'Silakan login dengan akun barumu.',
      };

      return res.redirect('/auth/login');
    } catch (error) {
      console.error(error);
      return res.render('auth/register', {
        layout: false,
        error: 'Gagal Register: ' + (error as Error).message,
      });
    }
  }

  @Get('logout')
  logout(@Req() req: any, @Res() res: Response) {
    req.session.user = null;

    req.session.flash = {
      type: 'success',
      title: 'Logout Berhasil',
      message: 'Sampai jumpa lagi! 👋',
    };

    res.redirect('/auth/login');
  }
}
