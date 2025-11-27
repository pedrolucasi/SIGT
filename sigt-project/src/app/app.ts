import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardTccComponent } from './components/dashboard-tcc/dashboard-tcc.component';
import { TccRegistrationComponent } from './components/tcc-registration/tcc-registration.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class App {
  protected readonly title = signal('sigt-project');
}
