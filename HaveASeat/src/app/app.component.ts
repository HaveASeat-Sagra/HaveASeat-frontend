import { Component, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MapaComponent } from './mapa/mapa.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MapaComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
  title = 'HaveASeat';
  selectedDate: string = '';
  userId :number = 1;

  onDateChanged(date: string): void {
    this.selectedDate = date;
    console.log(this.selectedDate);
  }
}
