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
              'Content-Type':  'application/json',
              'Tbk-Api-Key-Id': '597055555532',
              'Tbk-Api-Key-Secret':'579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'
            })
          };

        console.log(httpOptions.headers);
        return this.http.post<any>(`https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions`, transaccion, httpOptions);
    }

    
}