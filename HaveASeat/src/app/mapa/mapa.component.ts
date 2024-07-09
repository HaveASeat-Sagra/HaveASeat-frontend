import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent {

  //to są testy na razie prosze nie bic pls <3333
  map = [
    [
      { status: 'free' },
      { status: 'reserved' },
      { status: 'yours' }
    ],
    [
      { status: 'yours' },
      { status: 'free' },
      { status: 'reserved' }
    ],
    [
      { status: 'reserved' },
      { status: 'yours' },
      { status: 'free' }
    ]
  ];
}
