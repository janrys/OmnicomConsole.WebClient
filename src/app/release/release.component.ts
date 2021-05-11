import { Component, OnInit } from '@angular/core';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { Logger } from '@core';

const log = new Logger('Release');

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.scss'],
})
export class ReleaseComponent implements OnInit {
  constructor(private apiHttpService: ApiHttpService, private apiEndpointsService: ApiEndpointsService) {}

  ngOnInit(): void {}
}
