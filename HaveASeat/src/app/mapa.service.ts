import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapaService {

  private apiUrl = 'https://run.mocky.io/v3/5322fea8-2a61-4d3e-8a9d-b3eae7af9dbb';

  mapa :Room[] = []

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
}

export interface Room {
  id: number;
  name: string;
  cells: Cell[];
}
export interface Cell {
  id: number;
  positionX: number;
  positionY: number;
  border: string;
}