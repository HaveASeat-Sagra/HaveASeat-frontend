import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapaService {

  //private apiUrl = 'https://run.mocky.io/v3/7fbcc4df-6ade-4962-ab97-cde6e742a268';
  private apiUrl = 'https://localhost:7023/api/Map/GetAllMap';
  private reservationApi = 'https://localhost:7023/api/Reservation/getByDay/';
  private addReservationUrl = "https://localhost:7023/api/Reservation/newReservation";
  //private DeskApiUrl = 'https://run.mocky.io/v3/457acbb4-70a7-4b7c-82e0-534a259aa5a9';
  private deleteReservationUrl = "https://localhost:7023/api/Reservation/delete/";


  mapa: Room[] = []
  desks: Desk[] = []
  reservations: Reservation[] = [];

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

  date = new Date();
  public loadReservations(date: string | undefined): Observable<Reservation[]> {
    //if (date != '') {
    const twojastara = `${this.reservationApi}${date}`
    console.log(twojastara);
    return this.http.get<Reservation[]>(twojastara);
    // this.http.get<Reservation[]>(twojastara).subscribe({
    //   next: (dane: Reservation[]) => {
    //     this.reservations = dane;
    //     console.log(this.reservations);
    //     },
    //     error: (error) => {
    //       console.error('Błąd podczas pobierania rezerwacji:', error);
    //       }
    //       });
    //}

  }

  addReservation(reservation: NewReservation): Observable<NewReservation> {
    console.log("in service", reservation);
    return this.http.post<NewReservation>(this.addReservationUrl, reservation);
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }
  getDesks(): Observable<Desk[]> {
    return this.http.get<Desk[]>(this.apiUrl);
  }
  deleteReservationsById(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.deleteReservationUrl}${userId}`);
  }
}


export interface Room {
  id: number;
  name: string;
  cells: Cell[];
  desks: Desk[];
}

export interface Cell {
  imagePath: any;
  id: number;
  positionX: number;
  positionY: number;
  border: string;
  isDesk?: boolean;
  rotationClass?: string;
  isReserved?: boolean;
  isClicked?: boolean;
  isUsers?: boolean;
}
export interface Desk {
  id: number;
  positionX: number;
  positionY: number;
  chairPosition: number;
  rotation?: number;
}
export interface Reservation {
  id: number;
  date: string;
  desk: Desk;
  user: User;
}
export interface NewReservation {
  date: string;
  userId: number;
  deskId: number;
}

export interface User {
  id: number;
  email: string;
  role: number;
}