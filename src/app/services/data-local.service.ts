import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registros: Registro[] = [];

  constructor(private storage: Storage) { 
    this.cargarStorage();
  }

  guardarRegistro(format:string, text:string){

    const nuevoRegistro = new Registro(format,text);
    this.registros.unshift(nuevoRegistro);

    this.storage.set('registros', this.registros);

  }

  async cargarStorage(){
    this.registros = await this.storage.get('registros') || [];
  }

}
