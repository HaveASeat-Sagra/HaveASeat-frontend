import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Output() dateChanged: EventEmitter<string> = new EventEmitter<string>();

  onDateChange(event: any): void {
    const selectedDate = event.target.value;
    this.dateChanged.emit(selectedDate);
  }
}
