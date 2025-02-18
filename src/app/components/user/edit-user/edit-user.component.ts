import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/types/user.type';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RfidComponent } from '../../rfid/rfid.component';
import { Context } from 'src/app/types/context.type';

@Component({
  imports: [
    IonicModule,
    FormsModule,
    RfidComponent
  ],
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  public userId: string = '';
  public user: User = {} as User;
  public saveOutline = 'save-outline';
  public saveSharp = 'save-sharp';
  public trashOutline = 'trash-outline';
  public trashSharp = 'trash-sharp';
  public alertButtons = [
    {
      text: 'Excluir',
      role: 'confirm',
      handler: () => {
        this.deleteUser();
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
  public IsAwaitingRFID = false;
  public context: Context = 'create';
  public IsPermissionNotSelected = false;
  public alertHeader: string | undefined = undefined;
  public alertSubHeader: string | undefined = undefined;
  public alertMessage: string | undefined = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
  ) {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  ngOnInit() {
    if (this.userId) {
      this.userService.retrieveUser(this.userId).then((user: User) => {
        this.user = user;
        this.context = 'edit';
      });
    }
  }

  async saveUser() {
    if (!this.user.badge_number || !this.user.user_name) {
      this.showAlert('Atenção!', 'Campos obrigatórios não preenchidos.', 'Por favor, preencha os campos obrigatórios.');
      return;
    }
    if (!this.user.permissions) {
      this.showAlert('Atenção!', 'Nenhuma permissão foi selecionada.', 'Por favor, selecione ao menos uma permissão.');
      return;
    }
    this.IsAwaitingRFID = true;
    this.userId ? await this.updateUser() : await this.createUser();
  }

  async createUser() {
    this.userService.createUser(this.user);
  }

  async updateUser() {
    await this.userService.updateUser(this.user);
    this.router.navigate(['/main/users']);
    this.userService.retrieveAllUsers();
  }

  async deleteUser() {
    if (!this.user.id) return;
    await this.userService.deleteUser(this.user.id);
    this.router.navigate(['/main/users']);
    this.userService.retrieveAllUsers();
  }

  private showAlert(header: string, subHeader: string, message: string) {
    this.alertHeader = header;
    this.alertSubHeader = subHeader;
    this.alertMessage = message;
  }
}
