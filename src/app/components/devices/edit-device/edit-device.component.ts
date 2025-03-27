import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Device } from 'src/app/types/device.type';
import { Context } from 'src/app/types/context.type';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [
    IonicModule,
    FormsModule
  ],
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class EditDeviceComponent  implements OnInit {
    public deviceId: string = '';
    public device: Device = {} as Device;
    public saveOutline = 'save-outline';
    public saveSharp = 'save-sharp';
    public trashOutline = 'trash-outline';
    public trashSharp = 'trash-sharp';
    public alertButtons = [
      {
        text: 'Excluir',
        role: 'confirm',
        handler: () => {
          this.deleteDevice();
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
    public alertHandler = () => {
      this.hasError = false;
    };
    public context: Context = 'create';
    public alertHeader: string | undefined = undefined;
    public alertSubHeader: string | undefined = undefined;
    public alertMessage: string | undefined = undefined;
    public hasError = false;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  ngOnInit() {}

  saveDevice() {}

  deleteDevice() {}
}
