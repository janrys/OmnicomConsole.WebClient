import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user-service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  isImportAllowed: boolean;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isImportAllowed = this.userService.getIsImportAllowed();
  }
}
