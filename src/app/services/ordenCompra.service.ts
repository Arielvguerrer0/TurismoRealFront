import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class OrdenCompraService{
    constructor( private http: HttpClient ) { }

    crearOc( oc : object ): Observable<any>{
        return this.http.post<any>(`api/OrdenCompra/crear/`, oc);
    };

    modificarOc( oc : object ): Observable<any>{
        return this.http.post<any>(`api/OrdenCompra/modificar/`, oc);
    };
    
}