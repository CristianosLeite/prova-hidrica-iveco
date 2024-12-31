import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SettingsService } from 'src/app/services/settings/settings.service';

@Component({
  imports: [
    IonicModule,
    FormsModule,
  ],
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss'],
})
export class ServerComponent implements OnInit {
  public protocol = 'http';
  public saveOutline = 'save-outline';
  public saveSharp = 'save-sharp';
  public host = '';
  public port = '';
  public alertButtons = [
    {
      text: 'Reiniciar',
      role: 'confirm',
      handler: () => {
        this.reloadApp();
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
  ];

  constructor(
    private settingsService: SettingsService,
  ) { }

  async ngOnInit() {
    await this.loadServer();
  }

  async updateServer() {
    await this.settingsService.updateServer(this.protocol, this.host, this.port);
  }

  async loadServer() {
    const server = await this.settingsService.loadServer();
    this.protocol = server.protocol;
    this.host = server.host;
    this.port = server.port;
  }

  reloadApp() {
    this.settingsService.reloadApp();
  }
}
