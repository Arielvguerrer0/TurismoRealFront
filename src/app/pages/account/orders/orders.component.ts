import { Component, OnInit } from '@angular/core';
import { ReservaService } from 'src/app/services/reserva.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor(
    private reservaService: ReservaService,
    public snackBar: MatSnackBar,
  ) { }

  public reservas: any  = {};
  public idUsuario: number = null; 

  ngOnInit() {
    //Extraemos el id del usuario logeado y buscamos sus reservas.
    const { ID_USUARIO } = JSON.parse(localStorage.getItem('usuario'));
    this.idUsuario = ID_USUARIO;
    this.listarReservas(ID_USUARIO);
    
  }

  listarReservas(id: number) {
    this.reservaService.listarReservaUsuario(id)
      .subscribe( (res) => {
        this.reservas = res.map( (item: any) => {
          const res = item;
          res.FECHA_INGRESO = moment(res.FECHA_INGRESO).format('DD/MM/YYYY');
          res.FECHA_SALIDA = moment(res.FECHA_SALIDA).format('DD/MM/YYYY');
          res.CANT_DIA_RESERVA;
          // operador ternario en caso de que estado de reserva sea 1 mostraremos activo, de lo contrario cancelada.
          res.ESTADO_RESERVA = res.ESTADO_RESERVA == 1 ? res.ESTADO_RESERVA = 'ACTIVA' : 'CANCELADA';

          return res;
        })
      }, (err) => {
        console.log('tremendo error', err);
      });
  }


  cancelarReserva(reserva){
    const { ID_RESERVA } = reserva;
    const reservaAux = reserva;
    // esta no es la mejor practica, VER COMO ENVIAR EL NUEVO OBJETO MAPEADO.
    delete reservaAux.NOM_DEPTO;
    delete reservaAux.ID_RESERVA;
    /* console.log(' ESTE ES EL ID', ID_RESERVA) */
    reservaAux.ESTADO_RESERVA = 0;
    reservaAux.FECHA_ESTADO_RESERVA = moment(new Date ()).format('DD/MM/YYYY');
    reservaAux.FECHA_INGRESO = reserva.FECHA_INGRESO;
    reservaAux.FECHA_SALIDA = reserva.FECHA_SALIDA;
    reservaAux.DEPARTAMENTO_ID_DEPARTAMENTO = 1;
    reservaAux.USUARIO_ID_USUARIO = this.idUsuario
    
    console.log('RESERVA AUX', reservaAux)

    this.reservaService.eliminarReserva(reservaAux, ID_RESERVA)
      .subscribe( ( res) => {
        this.snackBar.open(`${res.response}`, '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });

        this.listarReservas(this.idUsuario)

      }, (err) => {
        console.log('tremendo error', err);
      })
  // modificar reserva.

}


}
