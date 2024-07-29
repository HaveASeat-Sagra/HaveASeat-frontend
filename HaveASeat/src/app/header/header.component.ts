import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../mapa.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [UserService]
})
export class HeaderComponent implements OnChanges{

  @Output() dateChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() userId!: number;

  today: string;
  username :string = "";
  user :User = <User>{};

  constructor(private userService : UserService) {
    this.today = new Date().toISOString().slice(0, 10);
  }

  ngOnChanges() {
    this.userService.getUserById(this.userId).subscribe({
      next: userData => {
        this.user = userData;
      },
      complete: () => {
        this.username = this.user.email.split('@')[0];
      },
      error: userError => {
        console.log("no such user" + userError);
      }
    });
  }


  onDateChange(event: any): void {
    const selectedDate = event.target.value;
    this.dateChanged.emit(selectedDate);
  }
}
