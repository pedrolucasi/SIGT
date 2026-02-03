import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TccStore } from '../../store/tcc-store';
import { TCC } from '../../model/tcc-model';

@Component({
  selector: 'app-tcc-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tcc-registration.component.html',
  styleUrls: ['./tcc-registration.component.css'],
})
export class TccRegistrationComponent {
  private fb = inject(FormBuilder);
  private store = inject(TccStore);
  private router = inject(Router);

  form: FormGroup;
  
  // Signals do store
  loading = this.store.loading;
  error = this.store.error;
  successMessage = this.store.successMessage;

  minDate: string;

  constructor() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];

    this.form = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(3)]],
      studentId: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{5,11}$'),
        ],
      ],
      advisorName: ['', [Validators.required, Validators.minLength(3)]],
      title: ['', [Validators.required, Validators.minLength(5)]],
      summary: ['', Validators.maxLength(1000)],
      modality: ['presencial', Validators.required],
      scheduledDate: [''],
      scheduledTime: [''],
      location: [''],
      committee: [''],
    });
  }

  private isFutureDate(date?: string): boolean {
    if (!date) return true;
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    return selected > today;
  }

  submit() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    const value = this.form.value;

    // Validação da data
    if (value.scheduledDate && !this.isFutureDate(value.scheduledDate)) {
      this.form.get('scheduledDate')?.setErrors({ notFuture: true });
      this.markFormGroupTouched(this.form);
      return;
    }

    const payload: TCC = {
      studentName: value.studentName.trim(),
      studentId: value.studentId.trim(),
      advisorName: value.advisorName.trim(),
      title: value.title.trim(),
      summary: value.summary?.trim() || undefined,
      status: 'cadastrada',
      modality: value.modality,
      scheduledDate: value.scheduledDate || undefined,
      scheduledTime: value.scheduledTime || undefined,
      location: value.location?.trim() || undefined,
      committee: value.committee
        ? value.committee.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [],
    };

    this.store.addTcc(payload);

    setTimeout(() => {
      if (!this.error() && this.successMessage()) {
        this.router.navigate(['/dashboard']);
      }
    }, 2000);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  clearError() {
    this.store.clearError();
  }

  clearSuccessMessage() {
    this.store.clearSuccessMessage();
  }
}