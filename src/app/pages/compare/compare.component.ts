import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data, AppService } from '../../app.service';
import { Product } from '../../app.models';
import { Router } from '@angular/router';
import { TransbankService } from 'src/app/services/transbank.service';
import { firstValueFrom } from 'rxjs';
import { UntypedFormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ReservaService } from 'src/app/services/reserva.service';
import { PagoService } from 'src/app/services/pago.service';
import { OrdenCompraService } from 'src/app/services/ordenCompra.service';


@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {
stepperOrientation: 'horizontal' | 'vertical' = "horizontal";
grandTotal = 0;
productAux: any = {}
idUser: '';
Date = null;
billingForm: UntypedFormGroup;
  
  constructor(
    public appService:AppService,
    public snackBar: MatSnackBar,
    private router: Router,
    private transbankService: TransbankService,
    private reservaService :ReservaService,
    private pagoService: PagoService,
    private ordenCompraService: OrdenCompraService
    ) { }

  ngOnInit() { 
    this.appService.Data.cartList.forEach(product=>{
      this.grandTotal += product.cartCount*product.newPrice;
      this.productAux = product;
    });
    const { ID_USUARIO } = JSON.parse(localStorage.getItem('usuario'));
    this.idUser = ID_USUARIO;

    this.commitTransaction();
  }

  public async listarIdReserva() { 
    const resp = await firstValueFrom(this.reservaService.listarUltimaReserva()); 

    return resp[0]
  }

  public async crearPago(amount: number) {
    console.log('monto', amount)
    const dateNow = moment(new Date() ).format('YYYY/MM/DD');
    console.log('dateNow', dateNow)
    let lastId = null;

    const body = {
      FECHA_PAGO : dateNow,
      MONTO_TOTAL : amount,
      TIPO_PAGO_ID_TIPO_PAGO: 1
    }

    const resp = await firstValueFrom(this.pagoService.crearPago(body))
    if(resp) {
      lastId = await firstValueFrom(this.pagoService.listarUltimoId())
    }

    return lastId[0]

  }

  public async crearOc(idPago, idReserva, amount) {
    console.log(idPago)
    console.log(idReserva)
    console.log(amount)
    const dateNow = moment(new Date() ).format('YYYY/MM/DD');

    const total = amount*2;

    const body = {
      FECHA_ORDEN_COMPRA: dateNow,
      DEBE: amount,
      TOTAL_COMPRA: total,
      RESERVA_ID_RESERVA: idReserva,
      PAGO_ID_PAGO: idPago
    }

    console.log('BODY', body)

    const resp = await firstValueFrom(this.ordenCompraService.crearOc(body))
    return resp;

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
      
       //Desesctructuramos el monto de pago.
       const { amount } = resp;

       if( resp ) {
        // enviamos el monto a la funcion pago para que cree el registro en la tabla.
        const idPago = await this.crearPago(amount)
        const { ID_PAGO } = idPago;
        const idReserva = await this.listarIdReserva();
        const { ID_RESERVA } = idReserva;

        const respOc = this.crearOc(ID_PAGO, ID_RESERVA, amount)
        console.log(respOc)
        
    
        /* crear el pago
          crear la orden compra
        
        */
       }
       
      };    
      return;
    } catch (error) {
      console.log('error', error)
      
    }
  }

  

}
