import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { filter, firstValueFrom, map, Subscription } from 'rxjs';
import { AppService } from '../../app.service';
import { ReservaService } from '../../services/reserva.service';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransbankService } from '../../services/transbank.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  stepperOrientation: 'horizontal' | 'vertical' = "horizontal";
  billingForm: UntypedFormGroup;
  deliveryForm: UntypedFormGroup;
  paymentForm: UntypedFormGroup;
  countries = [];
  months = [];
  years = [];
  deliveryMethods = [];
  grandTotal = 0;
  productAux: any = {}
  idUser: '';
  Date = null;
  watcher: Subscription;
  valid: boolean = true;
  transbank: any = {
    token: null,
    url: null,
  };



  constructor(
    public appService:AppService, 
    public formBuilder: UntypedFormBuilder, 
    public mediaObserver: MediaObserver,
    private reservaService :ReservaService,
    private transbankService: TransbankService,
    public snackBar: MatSnackBar,
    private router: Router
    
    ) {
    this.watcher = mediaObserver.asObservable()
    .pipe(filter((changes: MediaChange[]) => changes.length > 0), map((changes: MediaChange[]) => changes[0]))
    .subscribe((change: MediaChange) => {
      if (change.mqAlias == 'xs') {
        this.stepperOrientation = 'vertical';
      }
      else if(change.mqAlias == 'sm'){
        this.stepperOrientation = 'vertical';
      }
      else if(change.mqAlias == 'md'){
        this.stepperOrientation = 'horizontal';
      }
      else{
        this.stepperOrientation = 'horizontal';
      }
    });
  }

  ngOnInit() {    
    this.appService.Data.cartList.forEach(product=>{
      this.grandTotal += product.cartCount*product.newPrice;
      this.productAux = product;
    });
    this.countries = this.appService.getCountries();
    this.months = this.appService.getMonths();
    this.years = this.appService.getYears();
    this.deliveryMethods = this.appService.getDeliveryMethods();
    this.billingForm = this.formBuilder.group({
      dateInit: [ new Date() , Validators.required],
      dateEnd: '',
      cantDias: '',
    });
    this.deliveryForm = this.formBuilder.group({
      deliveryMethod: [this.deliveryMethods[0], Validators.required]
    });
    this.paymentForm = this.formBuilder.group({
      cardHolderName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiredMonth: ['', Validators.required],
      expiredYear: ['', Validators.required],
      cvv: ['', Validators.required]
    });

    const { ID_USUARIO } = JSON.parse(localStorage.getItem('usuario'));
    this.idUser = ID_USUARIO;
    this.Date = moment(new Date() ).format('YYYY/MM/DD');
    this.valid = true;

    this.commitTransaction();


  }


  validDateInit() {
    const DateInit: moment.Moment = moment(this.billingForm.get('dateInit').value);
    const resp = moment(DateInit).isBefore(this.Date);

    if ( resp ) {
      this.snackBar.open(`La fecha de inicio no puede ser menor al presente, `, '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });

      this.valid = true;
    } else {
      this.valid = false;
    }

  }

  changeDay() {
    const DateInit: moment.Moment = moment(this.billingForm.get('dateInit').value);
    const DateEnd: moment.Moment = moment(this.billingForm.get('dateEnd').value);
    const resp = moment(DateEnd).isSameOrBefore(DateInit, 'days');
    const same = moment(DateEnd).isSame(DateInit, 'days');

    // si la fecha final es menor a la inicial y NO son iguales, enviamos mensaje
    if ( resp && !same ) {
      this.snackBar.open(`La fecha final no puede ser menor a la inicial, `, '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      this.valid = true;
    } else {
      this.valid = false
    }

    const diff = DateEnd.diff(DateInit, 'days') + 1;
    this.billingForm.get('cantDias').setValue(diff) 

  }
  ngOnDestroy() { 
    this.watcher.unsubscribe();
  }

  createReserva(){ 
    console.log('next')
    const { id } = this.productAux;
    const DateInit: string = moment(this.billingForm.get('dateInit').value).format('YYYY/MM/DD');
    const DateEnd: string = moment(this.billingForm.get('dateEnd').value).format('YYYY/MM/DD');
    
    const body = {
        FECHA_INGRESO: DateInit,
        FECHA_SALIDA: DateEnd,
        CANT_DIA_RESERVA: 5,
        ESTADO_RESERVA: "1",
        FECHA_ESTADO_RESERVA: this.Date,
        DEPARTAMENTO_ID_DEPARTAMENTO: id,
        USUARIO_ID_USUARIO: this.idUser
    }

    console.log(body)

    this.reservaService.crearReserva(body)
      .subscribe( (resp) => {

        const parse = JSON.parse(resp.value)
        console.log('response', parse)
      }, (err) => {
        console.log('tremenedo error', err);
      })
  }

  public async placeOrder(){ 
    /* this.createReserva()
    this.horizontalStepper._steps.forEach(step => step.editable = false);
    this.appService.Data.cartList.length = 0;    
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0; */

  }

  public async initTrasaction() {

    
    try {
      const obj = {
          buy_order : "62406211",
          session_id: "84536944",
          amount: 910219,
          return_url : "http://127.0.0.1:4200/checkout"
      }
  
      const resp = await firstValueFrom(this.transbankService.crearTransaccion(obj));

      const {token, url } = resp;

      this.transbank.token = token;
      this.transbank.url = url;
  
      console.log('TRANBANK', this.transbank)
      
    } catch (error) {
      
      console.log('TREMENDO ERROR', error)
    }
  }

  public async commitTransaction() {
    const url = this.router.parseUrl(this.router.url);
    const token = url.queryParams['token_ws'];
    try {
      if(token) {
        const body = {
          token_ws: token
        }
       const resp = await firstValueFrom(this.transbankService.commitTransaccion(body))
       console.log('RESPUESTA', resp)
      }      
      return;
    } catch (error) {
      console.log('error', error)
      
    }
  }

}
