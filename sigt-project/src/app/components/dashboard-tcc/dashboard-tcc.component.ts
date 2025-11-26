import { Component, computed, effect, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TccService } from '../../services/tcc.service';
import { TCC } from '../../models/tcc.model';

@Component({
  selector: 'app-dashboard-tcc',
  standalone: true,
  // Adicione RouterModule para futuros botões de navegação (ex: ir para Cadastro)
  imports: [CommonModule, RouterModule], 
  templateUrl: './dashboard-tcc.component.html',
  styleUrls: ['./dashboard-tcc.component.css']
})
export class DashboardTccComponent implements OnInit {
  // 🟢 SIGNS: Lógica de listagem e estado movida
  tccs = signal<TCC[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedTccId = signal<number | null>(null);

  // 💻 Signal computado: TCC selecionado
  selectedTcc = computed(() => this.tccs().find(t => t.id === this.selectedTccId()));

  constructor(private service: TccService) {
    // Efeito para limpar erro
    effect(() => {
      if (this.error()) {
        setTimeout(() => this.error.set(null), 4000);
      }
    });
  }
  
  ngOnInit(): void {
    // 🌐 Carrega os dados na inicialização
    this.loadTccs();
  }

  loadTccs() {
    this.loading.set(true);
    this.service.getScheduledTccs().subscribe({
      next: (list) => {
        this.tccs.set(list || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar TCCs');
        this.loading.set(false);
      }
    });
  }

  selectTcc(id?: number) {
    this.selectedTccId.set(id ?? null);
  }

  formatDate(d?: string) {
    if (!d) return '-';
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString();
    } catch {
      return d;
    }
  }
}