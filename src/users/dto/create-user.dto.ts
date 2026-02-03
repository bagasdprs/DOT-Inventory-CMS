import { IsString, IsEmail, MinLength, Matches, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Format email salah' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @Matches(/^[A-Z]/, {
    message: 'Huruf pertama password WAJIB huruf besar (Uppercase)',
  })
  @Matches(/(?=.*\d)(?=.*[\W_])/, {
    message: 'Password harus mengandung angka dan simbol (!@#$)',
  })
  password: string;

  @IsString()
  @IsIn(['admin', 'staff', 'manager'], {
    message: 'Role harus salah satu dari: Admin, Staff, atau Manager',
  })
  role: string;
}
