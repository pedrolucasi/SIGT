import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Mantenha para rotas no template, se necessário
import { TccService } from '../../services/tcc.service';
import { TCC } from '../../models/tcc.model';

@Component({
  selector: 'app-tcc-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tcc-registration.component.html',
  styleUrls: ['./tcc-registration.component.css']
})
export class TccRegistrationComponent {
  form: FormGroup;

  // 🟢 SIGNS: Apenas lógica de submissão e feedback
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);

  constructor(private fb: FormBuilder, private service: TccService) {
    this.form = this.fb.group({
      studentName: ['', [Validators.required]],
      studentId: ['', [Validators.required]],
      advisorName: ['', [Validators.required]],
      title: ['', [Validators.required]],
      summary: [''],
      modality: ['presencial'],
      scheduledDate: [''],
      scheduledTime: [''],
      location: [''],
      committee: ['']
  });

    // Efeito para limpar erro/sucesso após um tempo
    effect(() => {
      if (this.error() || this.success()) {
        setTimeout(() => {
          this.error.set(null);
          this.success.set(false);
        }, 4000);
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const value = this.form.value;
    const payload: TCC = {
      // Usamos '!' pois os validadores garantem a presença nos campos requeridos
      studentName: value.studentName!,
      studentId: value.studentId!,
      advisorName: value.advisorName!,
      title: value.title!,
      summary: value.summary || undefined,
      status: 'cadastrada', // Define o status inicial
      modality: value.modality as 'presencial' | 'remoto' | 'hibrido',
      scheduledDate: value.scheduledDate || undefined,
      scheduledTime: value.scheduledTime || undefined,
      location: value.location || undefined,
      committee: value.committee ? value.committee.split(',').map((s: string) => s.trim()) : []
    };

    // 🌐 Requisição assíncrona
    this.service.createTcc(payload).subscribe({
      next: () => {
        this.form.reset({ modality: 'presencial' });
        this.success.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao cadastrar TCC. Tente novamente.');
        this.loading.set(false);
      }
    });
  }
}