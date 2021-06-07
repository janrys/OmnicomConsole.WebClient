import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user-service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements OnInit {
  isExportAllowed: boolean;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isExportAllowed = this.userService.getIsExportAllowed();
  }
}
