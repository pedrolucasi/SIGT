import { Component, computed, effect, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TccStore } from '../../store/tcc-store';
import { TCC } from '../../model/tcc-model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-tcc',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-tcc.component.html',
  styleUrls: ['./dashboard-tcc.component.css'],
})
export class DashboardTccComponent implements OnInit {
  private store = inject(TccStore);

  tccs = this.store.tccs;
  loading = this.store.loading;
  error = this.store.error;
  successMessage = this.store.successMessage;
  pagination = this.store.pagination;

  selectedTccId = signal<number | null>(null);
  showModal = signal(false);
  searchTerm = signal('');
  selectedStatus = signal<string>('');

  selectedTcc = computed(() => {
    const id = this.selectedTccId();
    return this.tccs().find(tcc => tcc.id === id) || null;
  });

  filteredTccs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.selectedStatus();
    
    return this.tccs().filter(tcc => {
      const matchesSearch = !term || 
        tcc.title.toLowerCase().includes(term) ||
        tcc.studentName.toLowerCase().includes(term) ||
        tcc.advisorName.toLowerCase().includes(term);
      
      const matchesStatus = !status || tcc.status === status;
      
      return matchesSearch && matchesStatus;
    });
  });

  constructor() {
    effect(() => {
      if (this.error()) {
        setTimeout(() => this.store.clearError(), 3000);
      }
    });
  }

  ngOnInit(): void {
    this.store.loadTccs();
  }

  selectTcc(id: number) {
    this.selectedTccId.set(id);
    this.store.loadTccById(id);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedTccId.set(null);
    this.store.clearSelectedTcc();
  }

  deleteTcc(id?: number) {
    if (id) {
      this.store.removeTcc(id);
      if (this.selectedTccId() === id) {
        this.closeModal();
      }
    }
  }

  updateStatus(id: number, status: string) {
    this.store.updateTccStatus(id, status);
  }

  changePage(page: number) {
    this.store.changePage(page);
  }

  filterByStatus(status: string) {
    this.selectedStatus.set(status);
    if (status) {
      this.store.filterByStatus(status);
    } else {
      this.store.loadTccs();
    }
  }

  search() {
    // Filtragem é feita no computed filteredTccs
  }

  formatDate(date?: string): string {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return date;
    }
  }

  formatTime(time?: string): string {
    if (!time) return '-';
    return time.substring(0, 5); // Formato HH:mm
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedStatus.set('');
    this.store.loadTccs();
  }
}