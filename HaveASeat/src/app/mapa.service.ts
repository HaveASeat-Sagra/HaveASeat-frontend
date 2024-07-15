import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapaService {

  private apiUrl = ' https://run.mocky.io/v3/bea00508-4098-443a-a4d3-a8072669a86e';
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
    // Replace 'your_desk_api_url' with the actual URL
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
}
export interface Desk {
  id: number;
  positionX: number;
  positionY: number;
  chairPosition: number;
}