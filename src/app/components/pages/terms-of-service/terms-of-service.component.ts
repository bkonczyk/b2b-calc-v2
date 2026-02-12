import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terms-of-service.component.html'
})
export class TermsOfServiceComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo(
      'Regulamin Serwisu',
      'Zasady korzystania z darmowego kalkulatora podatkowego B2B. Prawa autorskie, odpowiedzialność i warunki świadczenia usług.',
      '/regulamin'
    );
  }
}
