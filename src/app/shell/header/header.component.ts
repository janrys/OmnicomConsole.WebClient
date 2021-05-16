import { Component, OnInit } from '@angular/core';
import { UserMe } from '@app/@shared/models/UserMe';
import { UserService } from '@app/services/user-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  currentUser: UserMe;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getMe().subscribe((data) => {
      this.currentUser = data as UserMe;
    });
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }
}
