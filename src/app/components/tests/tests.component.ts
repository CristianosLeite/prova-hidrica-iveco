import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  imports: [
    IonicModule,
    RouterLink,
  ],
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss'],
})
export class TestsComponent implements OnInit {
  public tests = [
    { title: 'Verificar teto', url: '/main/upside-test', img: '../../../assets/img/upside-truck.webp', altImg: 'Upside truck', content: 'Verificar parte superior da cabine', status: 'pending' },
    { title: 'Verificar frente da cabine', url: '/main/frontside-test', img: '../../../assets/img/front-truck.webp', altImg: 'Frontside truck', content: 'Verificar vãos do para-brisa e painel frontal', status: 'pending' },
    { title: 'Verificar traseira da cabine', url: '/main/backside-test', img: '../../../assets/img/back-truck.webp', altImg: 'Backside truck', content: 'Verificar tampões do teto posterior', status: 'pending' },
    { title: 'Verificar lado esquerdo da cabine', url: '/main/leftside-test', img: '../../../assets/img/left-truck.webp', altImg: 'Leftside truck', content: 'Verificar vãos da lateral esquerda', status: 'pending' },
    { title: 'Verificar lado direito da cabine', url: '/main/rightside-test', img: '../../../assets/img/right-truck.webp', altImg: 'Rightside truck', content: 'Verificar vãos da lateral direita', status: 'pending' },
  ];

  constructor() { }

  ngOnInit() { }

}
