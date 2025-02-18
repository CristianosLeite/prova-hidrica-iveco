import { Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Context } from 'src/app/types/context.type';
import { ApiService } from 'src/app/services/api/api.service';
import { SocketResponse } from 'src/app/types/socketResponse.type';

@Component({
  imports: [
    IonicModule
  ],
  selector: 'app-codebar',
  templateUrl: './codebar.component.html',
  styleUrls: ['./codebar.component.scss'],
})
export class CodebarComponent  implements OnInit {
  @Input() context: Context | undefined;
  public title: string = 'Aguardando leitura do VP';
  public subtitle: string = 'Utilize o leitor de código de barras.';
  public content: string = 'Aguardando leitura...';

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.apiService.codeBarsReader().then((response: SocketResponse) => {
      console.log('Codebar response', response);
      this.content = response.payload.message;
    }).catch((data: any) => {
      console.error('Error reading code bars:', data['payload']['message']);
      this.title = 'Erro ao ler o código de barras.';
      this.subtitle = data['payload']['message'];
      this.content = '';

      setTimeout(() => {
        this.title = 'Aguardando leitura do VP';
        this.subtitle = 'Utilize o leitor de código de barras.';
        this.content = 'Aguardando leitura...';
      }, 5000);
    });
  }
}
