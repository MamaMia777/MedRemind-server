import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/app/users/user.service';
import { RequestInterface } from 'src/common/interfaces';
import { JwtService } from 'src/common/jwt/jwt.service';
// import { DatabaseService } from 'src/database/database.service';
@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestInterface;

    const authorization =
      request.signedCookies['MED_REMIND_AUTHORIZATION_COOKIE'];

    if (!authorization) throw new ForbiddenException();
    const decodedData = this.jwtService.verifyToken(authorization);
    if (!decodedData) throw new ForbiddenException();
    const userFound = await this.userService.getUserByEmail(decodedData.email);
    if (!userFound) throw new NotFoundException('User not found');
    request.email = userFound.email;
    return true;
  }
}
