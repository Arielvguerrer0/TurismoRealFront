import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/interfaces/user.interface';
import { emailValidator, matchingPasswords } from '../../../theme/utils/app-validators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  infoForm: UntypedFormGroup;
  passwordForm: UntypedFormGroup;
  user: Usuario;
  idUser: number = null;
  userName: string = null;
  userEmail: string = null;

  constructor(
    public formBuilder: UntypedFormBuilder,
    public snackBar: MatSnackBar,
    private authService: AuthService
     ) { }

  ngOnInit() {
    this.infoForm = this.formBuilder.group({
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      /* 'lastName': ['', Validators.compose([Validators.required, Validators.minLength(3)])], */
      'email': [this.user ? this.user.CORREO_USUARIO : '', Validators.compose([Validators.required, emailValidator])]
    });

    this.passwordForm = this.formBuilder.group({
      'currentPassword': ['', Validators.required],
      'newPassword': ['', Validators.required],
      'confirmNewPassword': ['', Validators.required]
    },{validator: matchingPasswords('newPassword', 'confirmNewPassword')});

    const { ID_USUARIO } = JSON.parse(localStorage.getItem('usuario'));
    this.idUser = ID_USUARIO
    this.initForm()
  }


  public initForm() {
    this.authService.buscarUsuarioid(this.idUser)
      .subscribe( (user) => {
      this.user = user[0];
      this.infoForm.get('firstName').setValue(this.user.NOM_USUARIO)
      this.infoForm.get('email').setValue(this.user.CORREO_USUARIO)
      })
  }

  public updateUser () { 
    let { ID_USUARIO, CONTRASENIA, ESTADO_USUARIO, TIPO_USUARIO_ID_TIPO_USUARIO } = this.user;
    const {firstName, email} = this.infoForm.value

    //Enviamos el body del usuario modificado
    const userModify = {
      NOM_USUARIO : firstName,
      CORREO_USUARIO: email,
      CONTRASENIA: CONTRASENIA,
      ESTADO_USUARIO: ESTADO_USUARIO ,
      TIPO_USUARIO_ID_TIPO_USUARIO: TIPO_USUARIO_ID_TIPO_USUARIO
    }
    this.authService.modificarUsuario(userModify, ID_USUARIO)
      .subscribe( (resp) => {
        this.snackBar.open(`${resp.response}!`, '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
      }, (err) => {
        this.snackBar.open(`Algo salio mal, `, '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      });
  }

  public updatPassword () { 
    let { ID_USUARIO, NOM_USUARIO, CORREO_USUARIO, CONTRASENIA, ESTADO_USUARIO, TIPO_USUARIO_ID_TIPO_USUARIO } = this.user;
    const {currentPassword, newPassword} = this.passwordForm.value
  
    const userModify = {
      NOM_USUARIO: NOM_USUARIO,
      CORREO_USUARIO: CORREO_USUARIO,
      CONTRASENIA: newPassword,
      ESTADO_USUARIO: ESTADO_USUARIO,
      TIPO_USUARIO_ID_TIPO_USUARIO: TIPO_USUARIO_ID_TIPO_USUARIO
    }
    
    if(CONTRASENIA === currentPassword) {
        this.authService.modificarUsuario(userModify, ID_USUARIO)
        .subscribe( (resp) => {
          this.snackBar.open(`${resp.response}!`, '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        }, (err) => {
          this.snackBar.open(`Algo salio mal, `, '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        });
      }
      this.snackBar.open(`La contraseña no corresponse`, '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      return
  }

  public onInfoFormSubmit(values:Object):void {
    if (this.infoForm.valid) {
      this.updateUser()
      this.snackBar.open('Usuario modificado Exitosamente!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }

  public onPasswordFormSubmit(values:Object):void {
    if (this.passwordForm.valid) {
      this.updatPassword()
    }
  }

}
