import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/types/user.type';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [
    IonicModule,
    FormsModule,
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
      });
    }
  }

  async saveUser() {
    ! this.userId ?
      await this.createUser() :
      await this.updateUser();
  }

  async createUser() {
    await this.userService.createUser(this.user);
    this.router.navigate(['/main/users']);
    this.userService.retrieveAllUsers();
  }

  async updateUser() {
    await this.userService.updateUser(this.user);
    this.router.navigate(['/main/users']);
    this.userService.retrieveAllUsers();
  }

  async deleteUser() {
    await this.userService.deleteUser(this.user.user_id);
    this.router.navigate(['/main/users']);
    this.userService.retrieveAllUsers();
  }
}
