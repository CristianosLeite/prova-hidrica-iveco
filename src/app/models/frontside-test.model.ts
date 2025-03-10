import { InfiltrationTest } from '../types/infiltrationTest.type';

const FrontsideTestModel: InfiltrationTest = {
  id: 'frontside',
  title: 'Verificar frente da cabine',
  url: '/main/frontside-test',
  img: '../../../assets/img/front-truck.webp',
  testImg: '../../../assets/img/frontside-test.webp',
  altImg: 'Frontside truck',
  content: 'Verificar vãos do para-brisa e painel frontal',
  status: 'pending',
  result: 'OK',
  points: [
    { id: 22, position: { top: '29%', left: '10%' } },
    { id: 23, position: { top: '29%', left: '44%' } },
    { id: 24, position: { top: '29%', left: '77%' } },
    { id: 25, position: { top: '41%', left: '9%' } },
    { id: 26, position: { top: '41%', left: '44%' } },
    { id: 27, position: { top: '41%', left: '78%' } },
    { id: 28, position: { top: '46%', left: '10%' } },
    { id: 29, position: { top: '46%', left: '77%' } },
    { id: 30, position: { top: '49%', left: '65%' } },
    { id: 31, position: { top: '49%', left: '21%' } },
    { id: 32, position: { top: '53%', left: '41%' } },
    { id: 33, position: { top: '55%', left: '52%' } }
  ]
}

export default FrontsideTestModel;
