import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: UntypedFormGroup;
  registerForm: UntypedFormGroup;

  constructor(
    public formBuilder: UntypedFormBuilder,
    public router:Router,
    public snackBar: MatSnackBar,
    private authService: AuthService
    ) { }

    user: any = null;
    passwordValid: boolean = false;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])] 
    });

    this.registerForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    },{validator: matchingPasswords('password', 'confirmPassword')});

    this.authService.listarUsuarios()
      .subscribe( (usuarios) => {
        console.log('LOS USUARIOS', usuarios)
      }, (err) => {
        console.log('HUBO UN ERROR', err)
      });

  }

  validarContrasena() {
    const { password } = this.loginForm.value;
      if (this.user.CONTRASENIA != password) {
        this.passwordValid = false;
        return this.passwordValid;
      } else {
        //Guardamos en el localstorage el correo
        this.passwordValid = true;
        return this.passwordValid;
      }
  };

  public onLoginFormSubmit(values:Object):void {
    const { email } = this.loginForm.value;
    this.authService.buscarUsuario(email)
      .subscribe( ( usuario) => {
        if(usuario) {
          this.user = usuario[0];
          const resp = this.validarContrasena()
          if(!resp) {
            console.log('contraseña no valida');
            return;
          }
          this.router.navigate(['/']);
        }
      }, (err) => {
        console.log(err);
      });
    /* if (this.loginForm.valid) {
      this.router.navigate(['/']);
    } */

  }

  public onRegisterFormSubmit(values:Object):void {
    if (this.registerForm.valid) {
      this.snackBar.open('You registered successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }

}
