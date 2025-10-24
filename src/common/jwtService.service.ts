import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AuthenticationService } from '../domain/services/authentication.service';

export interface CustomJwtPayload {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"?: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"?: string;
    jti?: string;
    exp?: number;
    iss?: string;
    aud?: string;
    ProjectId?: string;
    UserTypeId: string
}

@Injectable({
    providedIn: 'root',
})
export class JwtService {
    constructor(private authenticationService: AuthenticationService) { }

    // Helper method to decode the token
    private getDecodedToken(): CustomJwtPayload | null {
        const loginToken = this.authenticationService?.currentTokenValue;
        if (loginToken && loginToken.token) {
            try {
                return jwtDecode<CustomJwtPayload>(loginToken.token);
            } catch (error) {
                console.error("Invalid token:", error);
                return null;
            }
        }
        return null;
    }

    // Check if token is expired
    isTokenExpired(): boolean {
        const loginToken = this.authenticationService?.currentTokenValue;
        if (loginToken && loginToken.expiresIn) {
            return Date.now() > Date.now() + loginToken.expiresIn;
        }
        return true;
    }

    // Logout if token is expired
    logoutIfTokenExpired(): void {
        if (this.isTokenExpired()) {
            this.authenticationService.logout();
        }
    }

    // Getter methods for each field in the JWT payload

    getName(): string | null {
        const decoded = this.getDecodedToken();
        return decoded ? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || null : null;
    }

    getNameIdentifier(): string | null {
        const decoded = this.getDecodedToken();
        return decoded ? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null : null;
    }

    getGivenName(): string | null {
        const decoded = this.getDecodedToken();
        return decoded ? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] || null : null;
    }

    getSurname(): string | null {
        const decoded = this.getDecodedToken();
        return decoded ? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"] || null : null;
    }

    getJti(): string | null {
        const decoded = this.getDecodedToken();
        return decoded ? decoded.jti || null : null;
    }

    getExpiration(): number | null {
        const decoded = this.getDecodedToken();
        return decoded ? decoded.exp || null : null;
    }

    getIssuer(): string | null {
        const decoded = this.getDecodedToken();
        return decoded ? decoded.iss || null : null;
    }

    getAudience(): string | null {
        const decoded = this.getDecodedToken();
        return decoded ? decoded.aud || null : null;
    }

    getProjectId(): number | null {
        const decoded = this.getDecodedToken();
        return decoded && decoded.ProjectId ? parseInt(decoded.ProjectId) : null;
    }

    getUserTypeId(): number | null {
        const decoded = this.getDecodedToken();
        return decoded && decoded.UserTypeId ? parseInt(decoded.UserTypeId) : null;
    }
}
