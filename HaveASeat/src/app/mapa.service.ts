import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapaService {

  private apiUrl = 'https://run.mocky.io/v3/7fbcc4df-6ade-4962-ab97-cde6e742a268';
  //private DeskApiUrl = 'https://run.mocky.io/v3/457acbb4-70a7-4b7c-82e0-534a259aa5a9';

  mapa :Room[] = []
  desks:Desk[] = []

  constructor(private http: HttpClient) {
    
    this.http.get<Room[]>(this.apiUrl).subscribe({
      next: (dane: Room[]) => {
        this.mapa = dane;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania danych:', error);
      }
    });
      
    
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }
  getDesks(): Observable<Desk[]> {
    return this.http.get<Desk[]>(this.apiUrl);
  }
}


export interface Room {
  id: number;
  name: string;
  cells: Cell[];
  desks: Desk[];
}

export interface Cell {
  id: number;
  positionX: number;
  positionY: number;
  border: string;
  isDesk?: boolean;
  rotationClass?: string;
}
export interface Desk {
  id: number;
  positionX: number;
  positionY: number;
  chairPosition: number;
  rotation?: number;
}