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
          res.FECHA_INGRESO = moment(res.FECHA_INGRESO).format('YYYY/MM/DD');
          res.FECHA_SALIDA = moment(res.FECHA_SALIDA).format('YYYY/MM/DD');
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

    reservaAux.FECHA_INGRESO = moment(reservaAux.FECHA_INGRESO).format('YYYY/MM/DD');
    reservaAux.FECHA_SALIDA = moment(reservaAux.FECHA_SALIDA).format('YYYY/MM/DD');
    reservaAux.CANT_DIA_RESERVA = reserva.CANT_DIA_RESERVA;
    reservaAux.ESTADO_RESERVA = 0;
    reservaAux.FECHA_ESTADO_RESERVA = moment(new Date ()).format('YYYY/MM/DD');
    reservaAux.DEPARTAMENTO_ID_DEPARTAMENTO = 1;
    reservaAux.USUARIO_ID_USUARIO = this.idUsuario
  
    this.reservaService.eliminarReserva(reservaAux, ID_RESERVA)
      .subscribe( ( res) => {
        this.snackBar.open(`${res.response}`, '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });

        this.listarReservas(this.idUsuario)

      }, (err) => {
        console.log('tremendo error', err);
      })
}


}
