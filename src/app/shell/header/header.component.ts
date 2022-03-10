import { Component, OnInit } from '@angular/core';
import { Logger } from '../../@core/logger.service';
import { UserMe } from '@app/@shared/models/UserMe';
import { UserService } from '@app/services/user-service';
import { AuthService } from '@app/services/auth-service';
import { createTrue } from 'typescript';
import { TestRequest } from '@angular/common/http/testing';

const log = new Logger('HeaderComponent');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  currentUser: UserMe;
  isReadOnlyMode: boolean = true;
  isEditor: boolean = true;
  isAdmin: boolean = true;
  isReader: boolean = true;

  constructor(public userService: UserService, public authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isAuthorized) {
      this.loadUser();
      this.loadReadOnlyMode();
    }

    this.authService.isAuthorizatedOk().subscribe((isAuth) => {
      if (isAuth) {
        this.loadUser();
        this.loadReadOnlyMode();
      }
    });
  }

  loadUser() {
    this.userService.getMe().subscribe(
      (user) => {
        this.currentUser = user;
      },
      (error) => {
        log.debug(error);
      }
    );

    this.isEditor = this.userService.getIsEditor();
    this.isAdmin = this.userService.getIsAdmin();
    this.isReader = this.userService.getIsReader();
  }

  loadReadOnlyMode() {
    this.isReadOnlyMode = this.userService.getIsReadOnlyMode();
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
