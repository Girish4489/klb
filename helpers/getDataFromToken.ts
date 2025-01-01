import handleError from '@utils/error/handleError';
import { cookie, token } from '@utils/token/token';
import { NextRequest } from 'next/server';

export class UserTokenData {
  private decodedToken?: {
    id: string;
    username: string;
    email: string;
    companyAccess: {
      companyId: string;
      role: string;
      access: {
        login: boolean;
        canEdit: boolean;
        canDelete: boolean;
        canView: boolean;
      };
      accessLevels: string[];
    };
  };

  constructor(private request: NextRequest) {}

  static async create(request: NextRequest): Promise<UserTokenData> {
    const instance = new UserTokenData(request);
    await instance.init();
    return instance;
  }

  async init(): Promise<void> {
    try {
      const tokenValue = cookie.get(this.request);
      if (!tokenValue) {
        throw new Error('No token found');
      }
      const decoded = await token.verify(tokenValue);
      if (!decoded) {
        throw new Error('Invalid token');
      }
      this.decodedToken = {
        id: decoded.id,
        username: decoded.username || '',
        email: decoded.email || '',
        companyAccess: {
          companyId: decoded.companyAccess?.companyId.toString() || '',
          role: decoded.companyAccess?.role || 'guest',
          access: {
            login: decoded.companyAccess?.access.login || false,
            canEdit: decoded.companyAccess?.access.canEdit || false,
            canDelete: decoded.companyAccess?.access.canDelete || false,
            canView: decoded.companyAccess?.access.canView || false,
          },
          accessLevels: decoded.companyAccess?.accessLevels.map((level) => level.toString()) || [],
        },
      };
    } catch (error) {
      handleError.throw(error);
    }
  }

  getAllData(): {
    id: string;
    username: string;
    email: string;
    companyAccess: {
      companyId: string;
      role: string;
      access: {
        login: boolean;
        canEdit: boolean;
        canDelete: boolean;
        canView: boolean;
      };
      accessLevels: string[];
    };
  } {
    if (!this.decodedToken) {
      throw new Error('Token data is not initialized');
    }
    return {
      id: this.decodedToken.id,
      username: this.decodedToken.username,
      email: this.decodedToken.email,
      companyAccess: this.decodedToken.companyAccess,
    };
  }

  getId(): string {
    if (!this.decodedToken) {
      throw new Error('Token data is not initialized');
    }
    return this.decodedToken.id;
  }

  getUsername(): string {
    if (!this.decodedToken) {
      throw new Error('Token data is not initialized');
    }
    return this.decodedToken.username;
  }

  getEmail(): string {
    if (!this.decodedToken) {
      throw new Error('Token data is not initialized');
    }
    return this.decodedToken.email;
  }

  getCompanyId(): string {
    if (!this.decodedToken) {
      throw new Error('Token data is not initialized');
    }
    return this.decodedToken.companyAccess.companyId;
  }

  getLoginAccess(): boolean {
    if (!this.decodedToken) {
      throw new Error('Token data is not initialized');
    }
    return this.decodedToken.companyAccess.access.login;
  }

  getAccessLevels(): string[] {
    if (!this.decodedToken) {
      throw new Error('Token data is not initialized');
    }
    return this.decodedToken.companyAccess.accessLevels;
  }
}
