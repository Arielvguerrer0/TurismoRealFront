import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from "../interfaces/user.interface";
import { Reserva } from "../interfaces/reserva.interface";

@Injectable({
    providedIn: 'root'
})
export class ReservaService{
    constructor( private http: HttpClient ) { }

    crearReserva( reseva: object ): Observable<any>{
        return this.http.post<any>(`api/reserva/crear`, reseva);
    }

    eliminarReserva( reserva: any, id ): Observable<any>{
        return this.http.post<any>(`api/reserva/modificar/${id}`, reserva);
    }

    listarReservaUsuario( id: number ): Observable<any>{
        return this.http.get<any>(`api/reservausuario/${id}`, );
    }
}