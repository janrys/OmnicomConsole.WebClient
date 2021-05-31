import { Component, OnInit } from '@angular/core';
import { Logger } from '../../@core/logger.service';
import { UserMe } from '@app/@shared/models/UserMe';
import { UserService } from '@app/services/user-service';

const log = new Logger('HeaderComponent');

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
    this.userService.getMe().subscribe(
      (user) => {
        this.currentUser = user;
      },
      (error) => {
        log.debug(error);
      }
    );
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  login() {
    this.userService.getMe().subscribe(
      (user) => {
        this.currentUser = user;
      },
      (error) => {
        log.debug(error);
      }
    );
  }
}
