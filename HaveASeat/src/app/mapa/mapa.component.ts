import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgFor, NgStyle } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Desk, MapaService, Room, Cell, Reservation, User, NewReservation } from '../mapa.service';
import { NgIf } from '@angular/common';
import { forkJoin } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
  imports: [NgStyle, NgFor, HttpClientModule, NgIf, CommonModule, HeaderComponent],
  standalone: true,
  providers: [MapaService],
})
export class MapaComponent implements OnInit {
  roomWidth = 20;
  roomHeight = 13;
  rooms: Room[] = [];
  reservations:Reservation[] = [];
  clickedOnce = false;
  userId = 1;
  
  @Input() selectedDate?: string;
  
  constructor(private mapaService: MapaService) {}

  checkIfReserved(reservation :Reservation, cell :Cell) :boolean {
    return reservation.desk.positionX == cell.positionX && reservation.desk.positionY == cell.positionY;
  }

  checkIfBelongsToUser(reservation :Reservation, cell :Cell) :boolean {
    return (reservation.desk.positionX == cell.positionX && reservation.desk.positionY == cell.positionY) && reservation.user.id == this.userId;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDate']) {
        this.markReserved(changes['selectedDate'].currentValue);
    }
  }
  onDeskClick(cell: Cell) {
    // if (!this.clickedOnce && cell.isDesk && !cell.isReserved)
    if (cell.isDesk && !cell.isReserved)
     {
      this.rooms.forEach(room => {
        room.cells.forEach(c => {
          c.isClicked = false;
        })
      });
    }
    cell.isClicked = true;
    //this.clickedOnce = true;
    if(confirm("Book this seat?")) {
      const desk = this.getCellsDesk(cell);
      if(this.selectedDate)
      {
        const newReservation :NewReservation = {
          date: this.selectedDate,
          userId: this.userId,
          deskId: desk.id
        };
      this.mapaService.addReservation(newReservation).subscribe(
        response => {
          console.log("Reservation successful:", response);
        },
        error => {
          console.error("Reservation failed:", error);
        }
      );
    }
    } else {
      
    }
  }
  ngOnInit(): void {
    forkJoin({
      rooms: this.mapaService.getRooms(),
      //reservations: this.mapaService.getReservations()
      //desks: this.mapaService.getDesks()
    }).subscribe(
      ({ rooms }) => {
        this.rooms = rooms;
        //this.reservations = reservations;
        console.log('Rooms:', this.rooms);
        //console.log('reservations:', this.reservations);
        this.markDeskCells();
        
        const today = new Date();
        const date = today.toJSON().slice(0,10);
        this.markReserved(date);
        
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  getCellsDesk(cell: Cell): Desk {
    for (const room of this.rooms) {
      for (const desk of room.desks) {
        if (desk.positionX === cell.positionX && desk.positionY === cell.positionY) {
          return desk;
        }
      }
    }
    throw new Error('Desk not found for the given cell');
  }
  

  markReserved(date :string) {
    console.log("marking", date);
    forkJoin({
      reservations: this.mapaService.loadReservations(date)
    }).subscribe(
      ({ reservations }) => {
        this.reservations = reservations;
        this.rooms.forEach(room => {
          room.cells.forEach(cell => {
            if(this.reservations.some(reservation => this.checkIfBelongsToUser(reservation, cell)))
              {
                cell.isUsers = true;
              }
              else {
                cell.isReserved = this.reservations.some(reservation => this.checkIfReserved(reservation, cell));
              }
          })
        })
      },
      (error: any) => {
        console.error('Error fetching data:', error);
        this.rooms.forEach(room => {
          room.cells.forEach(cell => {
              cell.isReserved = false;
          })
        })
      }
    );
  }

  check(desk :Desk, cell :Cell) :boolean {
    //console.log("desk:", desk.positionX, desk.positionY);
    //console.log("cell:", cell.positionX, cell.positionY);
    return desk.positionX === cell.positionX && desk.positionY === cell.positionY;
  }
  getRotationClass(chairPosition: number): string  {
    
    switch (chairPosition) {
      case 1:
        //console.log("prawo")
        return 'rotate-right';
      case 2:
        //console.log("dol")
      return 'rotate-bottom';
      case 3:
        //console.log("lewo")
        return 'rotate-left';
      default:
        return '';
    }
  }

  markDeskCells(): void {
    if (this.rooms.length) {
      //console.log('Marking desk cells...');
      this.rooms.forEach(room => {
        room.cells.forEach(cell => {
          cell.isDesk = room.desks.some(desk => this.check(desk, cell));
          //console.log("uno") 
          //console.log(cell.positionX, cell.positionY);
          
          if (cell.isDesk) {
            //console.log(`Desk found at position (${cell.positionX}, ${cell.positionY})`);
            const desk = room.desks.find(desk =>this.check(desk, cell));
            if (desk) {
              cell.rotationClass = this.getRotationClass(desk.chairPosition);
            }
          } else {
            //console.log('Rooms or desks data not available yet.');
          }
        });
      });
    //console.log("yeet")
    }}

  getBorder(roomId: number, positionY: number, positionX: number): string {
    const room = this.rooms.find(r => r.id === roomId);
    const cell = room?.cells.find(c => c.positionX === positionX && c.positionY === positionY);
    return cell?.border ?? '';
  }

  isCellPresent(roomId: number, positionX: number, positionY: number): boolean {
    const room = this.rooms.find(r => r.id === roomId);
    return room?.cells.some(cell => cell.positionX === positionX && cell.positionY === positionY) ?? false;
  }

  getRange(n: number): number[] {
    return Array.from({ length: n }, (_, index) => index);
  }
  
}