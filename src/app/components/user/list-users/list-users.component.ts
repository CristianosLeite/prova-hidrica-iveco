import { Component, OnInit } from '@angular/core';
import { CaptionModule } from 'src/app/directives/caption/caption.module';
import { TooltipModule } from '../../tooltip/tooltip.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Permissions } from 'src/app/types/permissions.type';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/types/user.type';
import { RefresherEventDetail, IonRefresherCustomEvent } from '@ionic/core';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    IonicModule,
    CaptionModule,
    TooltipModule,
    RouterLink,
  ],
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {
  public personOutline = 'person-outline';
  public personSharp = 'person-sharp';
  public dataSource: { users: User[] } = { users: [] };
  public searchTerm: string = '';
  public hasError = false;
  public errorMessage = '';

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.retrieveAllUsers().catch((error: Error) => {
      this.hasError = true;
      this.errorMessage = error.message;
    });
    this.userService.usersChanged.subscribe((users: User[]) => {
      this.dataSource.users = users;
    });
  }

  search(e: Event) {
    this.userService.retrieveAllUsers().then((users: User[]) => {
      this.dataSource.users = users.filter((user) => {
        return user.UserName.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    });
  }

  handlePermissions(permission: string) {
    const value: { [key: string]: string } = {
      RU: 'Visualizar usuários cadastrados',
      WU: 'Cadastrar / Editar usuários',
      RR: 'Visualizar receitas cadastradas',
      WR: 'Cadastrar / Editar receitas',
      OA: 'Operar automático',
      OM: 'Operar manual',
      RO: 'Visualizar histórico de operações',
      RL: 'Visualizar logs',
      ER: 'Exportar Relatórios'
    };

    return value[permission];
  }

  getALLPermissions() {
    if (!this.dataSource.users) return [];
    let permissions: Permissions[] = [];
    this.dataSource.users.forEach((user) => {
      if (user.Permissions) {
        permissions = [
          ...permissions,
          ...user.Permissions.map((permission) => permission as Permissions),
        ];
      }
    });
    return [...new Set(permissions)];
  }

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      this.userService.retrieveAllUsers().then((users: User[]) => {
        this.dataSource.users = users;
      }).then(() => {
        event.target.complete();
      });
    }, 2000);
  }
}
