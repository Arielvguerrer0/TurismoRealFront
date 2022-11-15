import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../../interfaces/user.interface';
import * as bcrypt from 'bcrypt';
/* import { createHash } from 'crypto'; */



//Hash contraseña


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
    public usuarios: any;

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
      .subscribe( (usuarios: []) => {
        this.usuarios = usuarios;
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

  // funcion para validar que exista un usuario
  userExits( email ) {
    // buscamos el correo con todos los usuarios existentes.
    const usuario = this.usuarios.find(user => user.CORREO_USUARIO === email )
    if(usuario){ 
      // si el usuario existe la respuesta no va a existir.
      return false;
    }
    return true;
  }

  public onLoginFormSubmit(values:Object):void {
    const { email } = this.loginForm.value;
    // validamos que exista el usuario
    const resp = this.userExits(email)
    if (resp) {
      this.snackBar.open(`${'no existe usuario con el correo'} ${email}`, '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      return;
    }
    // llamamos al servicio.
    this.authService.buscarUsuario(email)
      .subscribe( ( usuario) => {
        if(usuario) {
          this.user = usuario[0];
          const resp = this.validarContrasena()
          if(!resp) {
            this.snackBar.open(`${'la contraseña no coincide'}`, '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
            return;
          }
          //Guardamos el usuario logeado en el local storage
          localStorage.setItem("usuario",JSON.stringify(this.user));
          this.router.navigate(['/']);
        }
      }, (err) => {
        return
      });
  }

  

  public onRegisterFormSubmit(values:Object):void {
    const {name, email, password  } = this.registerForm.value

    /* const hash = createHash('sha256',)
    const newpass = hash.update(password);
    console.log('CONTRASEÑA HASH', newpass); */

    /* const salt = bcrypt.genSaltSync(10);
    const pass = bcrypt.hashSync( password, salt);

    console.log('CONTRASEÑA HASH', pass) */

  

    const user = {
      ID_USUARIO: null,
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
