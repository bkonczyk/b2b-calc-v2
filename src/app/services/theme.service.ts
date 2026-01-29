import { Injectable, signal, effect, inject } from '@angular/core';
import { AppCookieService } from './cookie.service';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private cookieService = inject(AppCookieService);
  
  // Domyślnie ciemny, chyba że w cookie jest 'light'
  currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Efekt: przy zmianie sygnału, aktualizuj klasę na <html> i zapisz w cookie
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
      this.cookieService.set('theme', theme);
    });
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
  }

  toggleTheme() {
    this.currentTheme.update(current => current === 'dark' ? 'light' : 'dark');
  }

  private getInitialTheme(): Theme {
    const savedTheme = this.cookieService.get('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Domyślnie ciemny, jak w oryginale
    return 'dark';
  }

  private applyTheme(theme: Theme) {
    // Dostęp do dokumentu w bezpieczny sposób (zakładając browser environment)
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }
}
