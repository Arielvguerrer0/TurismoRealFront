import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class PagoService{
    constructor( private http: HttpClient ) { }

    crearPago( pago : object ): Observable<any>{
        return this.http.post<any>(`api/pago/crear/`, pago);
    };

    listarUltimoId(): Observable<any>{
        return this.http.get<any>(`api/listarPagoID/`);
    };
    
}