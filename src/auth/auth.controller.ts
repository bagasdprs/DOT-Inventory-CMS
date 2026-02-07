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
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      await this.authService.register(registerDto);

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    req.session = null;

    res.redirect('/auth/login');
  }
}
