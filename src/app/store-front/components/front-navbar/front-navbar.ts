import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'front-navbar',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './front-navbar.html'
})
export class FrontNavbar {
  public authService: AuthService = inject(AuthService);
}
