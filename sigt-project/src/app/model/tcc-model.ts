// src/app/model/tcc-model.ts
export interface TCC {
  id?: number;
  studentName: string;
  studentId: string;
  advisorName: string;
  title: string;
  summary?: string;
  modality: 'presencial' | 'remoto' | 'hibrido';
  scheduledDate?: string;
  scheduledTime?: string;
  location?: string;
  committee?: string[];
  status: 'cadastrada' | 'marcada' | 'apresentada' | 'finalizada' | 'cancelada' | string;
  created_at?: string;
}