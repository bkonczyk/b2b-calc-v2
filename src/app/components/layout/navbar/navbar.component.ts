import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Potrzebne dla ngClass itp.
import { B2bCalculatorService } from '../../../services/b2b-calculator.service';
import { TAX_FORM_OPTIONS, ZUS_OPTIONS } from '../../../models/b2b-types';


@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {

}
