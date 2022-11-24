import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from "../interfaces/user.interface";
import { Reserva } from "../interfaces/reserva.interface";

@Injectable({
    providedIn: 'root'
})
export class TransbankService{
    constructor( private http: HttpClient ) { }

    crearTransaccion( transaccion : object ): Observable<any>{
        const httpOptions = {
            headers: new HttpHeaders({
              'Access-Control-Allow-Origin': '*',
              'Tbk-Api-Key-Id': '597055555532',
              'Tbk-Api-Key-Secret':'579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
              'Content-Type':  'application/json',
            })
          };

        console.log(httpOptions.headers);
        return this.http.post<any>(`api/transbank/crear/`, transaccion);
    }

    
}