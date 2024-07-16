import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgStyle } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Desk, MapaService, Room, Cell } from '../mapa.service';
import { NgIf } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
  imports: [NgStyle, NgFor, HttpClientModule, NgIf, CommonModule],
  standalone: true,
  providers: [MapaService],
})
export class MapaComponent implements OnInit {
  roomWidth = 20;
  roomHeight = 13;
  rooms: Room[] = [];

  constructor(private mapaService: MapaService) {}

  ngOnInit(): void {
    forkJoin({
      rooms: this.mapaService.getRooms(),
      desks: this.mapaService.getDesks()
    }).subscribe(
      ({ rooms, desks }) => {
        this.rooms = rooms;
        console.log('Rooms:', this.rooms);
        this.markDeskCells();
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  check(desk :Desk, cell :Cell) :boolean {
    console.log("desk:", desk.positionX, desk.positionY);
    console.log("cell:", cell.positionX, cell.positionY);
    return desk.positionX === cell.positionX && desk.positionY === cell.positionY;
  }
  getRotationClass(rotation: number): string {
    switch (rotation) {
      case 1:
        console.log("prawo")
        return 'rotate-right';
      case 2:
        console.log("dol")
      return 'rotate-bottom';
      case 3:
        console.log("lewo")
        return 'rotate-left';
      default:
        return '';
    }
  }

  markDeskCells(): void {
    if (this.rooms.length) {
      console.log('Marking desk cells...');
      this.rooms.forEach(room => {
        room.cells.forEach(cell => {
          cell.isDesk = room.desks.some(desk => this.check(desk, cell));
          //console.log("uno") 
          console.log(cell.positionX, cell.positionY);
          if (cell.isDesk) {
            console.log(`Desk found at position (${cell.positionX}, ${cell.positionY})`);
          } else {
            console.log('Rooms or desks data not available yet.');
          }
        });
      });
    console.log("yeet")
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