import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Usuario } from 'src/app/interfaces/user.interface';
import { AppService } from '../../../app.service';
import { Settings, AppSettings } from '../../../app.settings';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html'
})
export class TopMenuComponent implements OnInit {
  public currencies = ['USD', 'EUR'];
  public currency:any; 
  public name: string; 
  public user: Usuario;
  idUser: number = null;

  public settings: Settings;
  constructor(
    public appSettings:AppSettings,
    public appService:AppService,
    private authService: AuthService,
    public translateService: TranslateService) { 
    this.settings = this.appSettings.settings; 
  } 

  ngOnInit() {
    this.currency = this.currencies[0];  
    //traemos la infomacion del usuario logeado
    /* this.user = JSON.parse(localStorage.getItem('usuario')); */
    const { ID_USUARIO } = JSON.parse(localStorage.getItem('usuario'));
    this.idUser = ID_USUARIO
    this.getUsuario()

  }

  getUsuario() {
    this.authService.buscarUsuarioid(this.idUser)
      .subscribe( (user) => {
      this.user = user[0];
      })
  }

  public changeCurrency(currency){
    this.currency = currency;
  } 

  public changeLang(lang:string){ 
    this.translateService.use(lang);   
  } 

  public DeleteSesion(){
    localStorage.removeItem('usuario');
    this.user = null;
  }

  public getLangText(lang){
    if(lang == 'de'){
      return 'German';
    }
    else if(lang == 'fr'){
      return 'French';
    }
    else if(lang == 'ru'){
      return 'Russian';
    }
    else if(lang == 'tr'){
      return 'Turkish';
    }
    else{
      return 'English';
    }
  } 

}
