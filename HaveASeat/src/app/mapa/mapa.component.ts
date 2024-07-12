import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgStyle } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MapaService } from '../mapa.service';
import { NgIf } from '@angular/common';

interface Cell {
  id: number;
  positionX: number;
  positionY: number;
  border: string;
}

export interface Room {
  id: number;
  name: string;
  cells: Cell[];
}

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
  imports: [NgStyle, NgFor, HttpClientModule, NgIf],
  standalone: true,
  providers: [MapaService],
})
export class MapaComponent implements OnInit {
  roomWidth = 20;
  roomHeight = 13;
  rooms: Room[] = [];

  constructor(private mapaService: MapaService) {}

  ngOnInit(): void {
    this.mapaService.getRooms().subscribe(
      (rooms: Room[]) => {
        this.rooms = rooms;
        console.log(rooms);
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

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