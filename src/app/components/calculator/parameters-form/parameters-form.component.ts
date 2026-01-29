import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { B2bCalculatorService } from '../../../services/b2b-calculator.service';
import { TAX_FORM_OPTIONS, ZUS_OPTIONS } from '../../../models/b2b-types';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-parameters-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parameters-form.component.html',
  styleUrl: './parameters-form.component.scss'
})
export class ParametersFormComponent implements OnInit, OnDestroy {
  service = inject(B2bCalculatorService);
  taxOptions = TAX_FORM_OPTIONS;
  zusOptions = ZUS_OPTIONS;

  private incomeInput$ = new Subject<number>();
  private subscription: Subscription | undefined;

  ngOnInit(): void {
    this.subscription = this.incomeInput$.pipe(
      debounceTime(300)
    ).subscribe(value => {
      this.service.setIncome(value);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onIncomeInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.incomeInput$.next(value);
  }

  getValue(event: Event): number { return Number((event.target as HTMLInputElement).value); }
  getStringValue(event: Event): string { return (event.target as HTMLSelectElement).value; }
}