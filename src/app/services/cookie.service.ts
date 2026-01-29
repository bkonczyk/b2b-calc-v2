import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AppCookieService {

  constructor(private cookieService: CookieService) { }

  public set(name: string, value: string): void {
    this.cookieService.set(name, value);
  }

  public get(name: string): string {
    return this.cookieService.get(name);
  }

  public check(name: string): boolean {
    return this.cookieService.check(name);
  }

  public delete(name: string): void {
    this.cookieService.delete(name);
  }
}
