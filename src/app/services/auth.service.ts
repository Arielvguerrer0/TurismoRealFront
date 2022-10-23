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
        return this.http.get<Usuario[]>(`api/usuariocorreo/${correo}`) 
    }

    buscarUsuarioid(id): Observable<Usuario[]>{
        return this.http.get<Usuario[]>(`api/usuario/${id}`) 
    }

    agregarUsuario( usuario: Usuario ): Observable<any>{
        return this.http.post<any>(`api/usuario/crear/`, usuario);
    }

    modificarUsuario( usuario: any, id ): Observable<any>{
        return this.http.post<any>(`api/usuario/modificar/${id}`, usuario);
    }

}