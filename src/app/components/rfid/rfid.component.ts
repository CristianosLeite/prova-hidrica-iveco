import { Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Context } from 'src/app/types/context.type';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  imports: [
    IonicModule
  ],
  selector: 'app-rfid',
  templateUrl: './rfid.component.html',
  styleUrls: ['./rfid.component.scss'],
})
export class RfidComponent  implements OnInit {
  @Input() context: Context | undefined;
  public subtitle: string = 'Aproxime o cartão RFID do leitor';
  public content: string = 'Aguardando cartão RFID...';

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    if (this.context === 'create') {
      this.subtitle = 'Cadastrar novo usuário';
      this.content = 'Por favor, aproxime o crachá do usuário a ser cadastrado do leitor RFID.';
    } else if (this.context === 'authenticate') {
      this.subtitle = 'Autenticar usuário';
      this.content = 'Aproxime o crachá do leitor RFID para autenticar-se.';
      this.apiService.listenAuthentication();
    }
  }
}
