import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../../interfaces/user.interface';
/* import { createHash } from 'crypto'; */

//Hash contraseña
/* import { passwordHash } from 'pbkdf2-password-hash'; */

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

    user: Usuario;
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

    /* this.authService.listarUsuarios()
      .subscribe( (usuarios) => {
        console.log('LOS USUARIOS', usuarios)
      }, (err) => {
        console.log('HUBO UN ERROR', err)
      }); */
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
    const {name, email, password  } = this.registerForm.value

    /* const hash = createHash('sha256',)
    const newpass = hash.update(password);
    console.log(newpass);
 */


    /* passwordHash.hash(password)
    .then((hash) => {
      console.log('contraseña hasheada', hash)
    }); */

    const user = {
      NOM_USUARIO: name,
      CORREO_USUARIO: email,
      CONTRASENIA: password,
      ESTADO_USUARIO: 1,
      TIPO_USUARIO_ID_TIPO_USUARIO: 3,
    }

    if (this.registerForm.valid) {
      this.authService.agregarUsuario(user)
        .subscribe( ( res ) => {
          
          this.snackBar.open(`${res.response}`, '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        }, (err) => {
          console.log('tremendo error', err );
        });
      
    }
  }

}
