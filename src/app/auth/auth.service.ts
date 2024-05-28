import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Auth, google } from 'googleapis';
import { IUser } from 'src/common/interfaces/user';
import { JwtService } from 'src/common/jwt/jwt.service';
import { User } from 'src/common/schemas/user.schema';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  private readonly oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET);
    this.oauthClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_SECRET,
      'http://localhost:3000/auth/google/callback',
      // 'https://wsp.company/auth/google/callback',
    );
  }

  public async getMe(email: string): Promise<User> {
    return await this.userService.getUserByEmail(email);
  }
  public async login(code: string): Promise<any> {
    try {
      const { tokens } = await this.oauthClient.getToken(code);
      const data = await this.oauthClient.getTokenInfo(tokens.access_token);
      if (!data) throw new InternalServerErrorException();
      const profileData = await this.getGoogleProfile(tokens.access_token);

      const userProfile: IUser = {
        name: profileData.given_name,
        surname: profileData.family_name,
        email: profileData.email,
        avatarUrl: profileData.picture,
      };
      const userFound = await this.userService.getUserByEmail(
        userProfile.email,
      );
      if (!userFound) {
        const newUser = await this.userService.createUser(userProfile);
        if (newUser) {
          return this.jwtService.generateToken(
            {
              email: newUser.email,
              surname: newUser.surname,
            },
            '1y',
          );
        }
      } else {
        return this.jwtService.generateToken(
          {
            email: userFound.email,
            surname: userFound.surname,
          },
          '1y',
        );
      }
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Error while login');
    }
  }

  private async getGoogleProfile(token: string) {
    const userInfo = google.oauth2('v2').userinfo;
    this.oauthClient.setCredentials({
      access_token: token,
    });
    const userInfoResponse = await userInfo.get({
      auth: this.oauthClient,
    });
    return userInfoResponse.data;
  }

  public async getAuthUrl(): Promise<string> {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];
    return this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
      redirect_uri: 'http://localhost:3000/auth/google/callback',
      // redirect_uri: 'https://wsp.company/auth/google/callback',
    });
  }
}
