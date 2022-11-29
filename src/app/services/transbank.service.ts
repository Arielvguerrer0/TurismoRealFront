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
        return this.http.post<any>(`api/transbank/crear/`, transaccion);
    };

    commitTransaccion( obj : object ): Observable<any>{
        return this.http.post<any>(`api/transbank/commit/`, obj);
    };



    
}