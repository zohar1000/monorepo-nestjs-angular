import { Component } from '@angular/core';
import { AuthService } from '@shared-apps/services/auth.service';
import { User } from '@shared-all/models/entities/user.entity';
import { SharedAppsModule } from '@shared-apps-module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  standalone: true,
  imports: [SharedAppsModule]
})
export class PagesComponent {
  user: Partial<User>;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.user;
  }

  onClickLogout() {
    this.authService.onLogout();
    this.router.navigate(['/login']).then();
  }
}
