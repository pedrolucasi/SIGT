import { Injectable, signal, computed, inject } from '@angular/core';
import { TccService } from '../service/tcc-service';
import { TCC } from '../model/tcc-model';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';

interface TccState {
  tccs: TCC[];
  selectedTcc: TCC | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TccStore {
  private tccService = inject(TccService);

  private state = signal<TccState>({
    tccs: [],
    selectedTcc: null,
    loading: false,
    error: null,
    successMessage: null,
    pagination: {
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0
    }
  });

  tccs = computed(() => this.state().tccs);
  selectedTcc = computed(() => this.state().selectedTcc);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  successMessage = computed(() => this.state().successMessage);
  pagination = computed(() => this.state().pagination);

  private setLoading(loading: boolean) {
    this.state.update(state => ({ ...state, loading }));
  }

  private setError(error: string | null) {
    this.state.update(state => ({ ...state, error }));
  }

  private setSuccessMessage(message: string | null) {
    this.state.update(state => ({ ...state, successMessage: message }));
  }

  loadTccs(page?: number, size?: number, status?: string) {
    this.setLoading(true);
    this.setError(null);

    this.tccService.getTccs({ page, size, status }).pipe(
      tap((tccs: TCC[]) => {
        this.state.update(state => ({
          ...state,
          tccs: tccs,
          pagination: {
            ...state.pagination,
            page: page || 0,
            size: size || 10
          }
        }));
      }),
      catchError(error => {
        this.setError('Erro ao carregar TCCs. Tente novamente.');
        console.error('Error loading TCCs:', error);
        return of([] as TCC[]);
      }),
      finalize(() => this.setLoading(false))
    ).subscribe();
  }

  loadTccById(id: number) {
    this.setLoading(true);
    this.setError(null);

    this.tccService.getTccById(id).pipe(
      tap(tcc => {
        this.state.update(state => ({ ...state, selectedTcc: tcc }));
      }),
      catchError(error => {
        this.setError('Erro ao carregar detalhes do TCC.');
        console.error('Error loading TCC:', error);
        return of(null);
      }),
      finalize(() => this.setLoading(false))
    ).subscribe();
  }

  addTcc(tcc: TCC) {
    this.setLoading(true);
    this.setError(null);
    this.setSuccessMessage(null);

    this.tccService.createTcc(tcc).pipe(
      tap(newTcc => {
        this.state.update(state => ({
          ...state,
          tccs: [...state.tccs, newTcc]
        }));
        this.setSuccessMessage('TCC cadastrado com sucesso!');
        
        setTimeout(() => this.setSuccessMessage(null), 5000);
      }),
      catchError(error => {
        this.setError('Erro ao cadastrar TCC. Verifique os dados.');
        console.error('Error creating TCC:', error);
        return of(null);
      }),
      finalize(() => this.setLoading(false))
    ).subscribe();
  }

  updateTcc(id: number, tcc: TCC) {
    this.setLoading(true);
    this.setError(null);
    this.setSuccessMessage(null);

    this.tccService.updateTcc(id, tcc).pipe(
      tap(updatedTcc => {
        this.state.update(state => ({
          ...state,
          tccs: state.tccs.map(t => t.id === id ? updatedTcc : t),
          selectedTcc: updatedTcc
        }));
        this.setSuccessMessage('TCC atualizado com sucesso!');
        
        setTimeout(() => this.setSuccessMessage(null), 5000);
      }),
      catchError(error => {
        this.setError('Erro ao atualizar TCC.');
        console.error('Error updating TCC:', error);
        return of(null);
      }),
      finalize(() => this.setLoading(false))
    ).subscribe();
  }

  updateTccStatus(id: number, status: string) {
    this.setLoading(true);
    
    this.tccService.patchTcc(id, { status }).pipe(
      tap(updatedTcc => {
        this.state.update(state => ({
          ...state,
          tccs: state.tccs.map(t => t.id === id ? updatedTcc : t),
          selectedTcc: updatedTcc
        }));
        this.setSuccessMessage('Status atualizado!');
        
        setTimeout(() => this.setSuccessMessage(null), 3000);
      }),
      catchError(error => {
        this.setError('Erro ao atualizar status.');
        console.error('Error updating status:', error);
        return of(null);
      }),
      finalize(() => this.setLoading(false))
    ).subscribe();
  }

  removeTcc(id: number) {
    if (!confirm('Tem certeza que deseja excluir este TCC?')) return;

    this.setLoading(true);
    this.setError(null);

    this.tccService.deleteTcc(id).pipe(
      tap(() => {
        this.state.update(state => ({
          ...state,
          tccs: state.tccs.filter(t => t.id !== id),
          selectedTcc: null
        }));
        this.setSuccessMessage('TCC excluído com sucesso!');
        
        setTimeout(() => this.setSuccessMessage(null), 5000);
      }),
      catchError(error => {
        this.setError('Erro ao excluir TCC.');
        console.error('Error deleting TCC:', error);
        return of(null);
      }),
      finalize(() => this.setLoading(false))
    ).subscribe();
  }

  filterByStatus(status: string) {
    this.setLoading(true);
    this.setError(null);

    this.tccService.getTccs({ status }).pipe(
      tap((tccs: TCC[]) => {
        this.state.update(state => ({ ...state, tccs }));
      }),
      catchError(error => {
        this.setError('Erro ao filtrar TCCs.');
        console.error('Error filtering TCCs:', error);
        return of([] as TCC[]);
      }),
      finalize(() => this.setLoading(false))
    ).subscribe();
  }

  changePage(page: number) {
    this.loadTccs(page, this.state().pagination.size);
  }

  clearSelectedTcc() {
    this.state.update(state => ({ ...state, selectedTcc: null }));
  }

  clearError() {
    this.setError(null);
  }

  clearSuccessMessage() {
    this.setSuccessMessage(null);
  }

  reset() {
    this.state.set({
      tccs: [],
      selectedTcc: null,
      loading: false,
      error: null,
      successMessage: null,
      pagination: {
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
      }
    });
  }
}