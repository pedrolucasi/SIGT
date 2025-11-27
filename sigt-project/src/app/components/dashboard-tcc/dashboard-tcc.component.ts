import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TccStore } from '../../store/tcc-store';
import { TCC } from '../../model/tcc-model';

@Component({
  selector: 'app-dashboard-tcc',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-tcc.component.html',
  styleUrls: ['./dashboard-tcc.component.css']
})
export class DashboardTccComponent implements OnInit {

  tccs: any;
  loading: any;
  error: any;

  selectedTccId = signal<number | null>(null);

  selectedTcc = computed<TCC | null>(() => {
    const list = this.tccs();
    const id = this.selectedTccId();

    if (!Array.isArray(list)) return null;
    if (id === null) return null;

    return list.find(t => t.id === id) ?? null;
  });

  constructor(private store: TccStore) {

    this.tccs = this.store.tccList$;
    this.loading = this.store.loading$;
    this.error = this.store.error$;

    effect(() => {
      if (this.error()) {
        setTimeout(() => this.store.clearError(), 3000);
      }
    });
  }

  



  ngOnInit(): void {
    this.store.loadTccs();
  }

  selectTcc(id?: number) {
    this.selectedTccId.set(id ?? null);
  }

  formatDate(d?: string) {
    if (!d) return '-';
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  }
}
