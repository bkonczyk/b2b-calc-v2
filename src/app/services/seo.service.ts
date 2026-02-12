import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  /**
   * Ustawia tytuł strony, opis meta oraz tag kanoniczny.
   * @param title Tytuł strony (zostanie do niego doklejony suffix)
   * @param description Opis strony dla wyszukiwarek (150-160 znaków)
   * @param path Ścieżka URL (np. '/regulamin')
   */
  updateSeo(title: string, description: string, path: string = '') {
    // 1. Ustawienie tytułu
    const fullTitle = `${title} | Kalkulator B2B 2026`;
    this.titleService.setTitle(fullTitle);

    // 2. Ustawienie opisu (Meta Description)
    this.metaService.updateTag({ name: 'description', content: description });

    // 3. Open Graph (Facebook, LinkedIn)
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: `https://kalkb2b.pl${path}` });

    // 4. Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });

    // 5. Canonical URL
    this.createCanonicalLink(`https://kalkb2b.pl${path}`);
  }

  private createCanonicalLink(url: string) {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
