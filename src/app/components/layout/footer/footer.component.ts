import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent {
    @Output() openPrivacyPolicy = new EventEmitter<void>();

    onPrivacyPolicyClick(event: Event) {
        event.preventDefault();
        this.openPrivacyPolicy.emit();
    }
}
