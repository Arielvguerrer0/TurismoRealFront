import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from "../interfaces/user.interface";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    constructor( private http: HttpClient ) { }

    listarUsuarios(): Observable<Usuario[]>{
        return this.http.get<Usuario[]>('api/usuarioAdmin/')
    }

    buscarUsuario(correo): Observable<Usuario[]>{
        return this.http.get<Usuario[]>(`api/usuario/${correo}`) 
    }

    agregarUsuario( usuario: Usuario ): Observable<any>{
        console.log('USUARIO', usuario);
        return this.http.post<any>(`api/usuario/crear/`, usuario);
    }

}