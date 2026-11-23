import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Component, provideZoneChangeDetection } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { routes } from './app/app.routes';
import { ThanhDieuHuongComponent } from './app/components/thanh-dieu-huong/thanh-dieu-huong';
import { ChanTrangComponent } from './app/components/chan-trang/chan-trang';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ThanhDieuHuongComponent, ChanTrangComponent],
  template: `
    <app-thanh-dieu-huong *ngIf="!laTrangAdmin"></app-thanh-dieu-huong>
    <main [class.pt-20]="!laTrangAdmin" style="min-height:100vh">
      <router-outlet></router-outlet>
    </main>
    <app-chan-trang *ngIf="!laTrangAdmin"></app-chan-trang>
  `
})
export class AppComponent {
  laTrangAdmin = false;
  constructor(private router: Router) {
    this.laTrangAdmin = this.router.url.startsWith('/admin') || this.router.url.startsWith('/staff');
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => { this.laTrangAdmin = this.router.url.startsWith('/admin') || this.router.url.startsWith('/staff'); });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
});
