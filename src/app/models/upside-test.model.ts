import { InfiltrationTest } from 'src/app/types/infiltrationTest.type';

const UpsideTestModel: InfiltrationTest = {
  id: 'upside',
  title: 'Verificar teto',
  url: '/main/upside-test',
  img: '../../../assets/img/upside-truck.webp',
  testImg: '../../../assets/img/frontside-test.webp',
  altImg: 'Upside truck',
  content: 'Verificar parte superior da cabine',
  status: 'pending',
  result: 'OK',
  points: [
    { id: 1, position: { top: '10%', left: '44%' } },
    { id: 2, position: { top: '13%', left: '22%' } },
    { id: 3, position: { top: '13%', left: '65%' } },
    { id: 4, position: { top: '17%', left: '13%' } },
    { id: 5, position: { top: '17%', left: '74%' } }
  ]
}

export default UpsideTestModel;
