import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.html'
})
export class RegisterPage {
  private _fb: FormBuilder = inject(FormBuilder);
  private _authService: AuthService = inject(AuthService);

  public registerForm: FormGroup = this._fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public hasError: WritableSignal<boolean> = signal(false);
  public isSuccessful: WritableSignal<boolean> = signal(false);

  public submitForm(): void {
    if (this.registerForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return;
    }

    const {fullName, email, password} = this.registerForm.value;
    this._authService.registerAccount(fullName, email, password).subscribe(() => {
      this.isSuccessful.set(true);
      setTimeout(() => this.isSuccessful.set(false), 2000);
    });
  }
}
