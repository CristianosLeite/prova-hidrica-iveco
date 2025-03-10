import { InfiltrationTest } from "../types/infiltrationTest.type";

const BacksideTestModel: InfiltrationTest = {
  id: 'backside',
  title: 'Verificar traseira da cabine',
  url: '/main/backside-test',
  img: '../../../assets/img/back-truck.webp',
  testImg: '../../../assets/img/backside-test.webp',
  altImg: 'Backside truck',
  content: 'Verificar tampões do teto posterior',
  status: 'pending',
  result: 'OK',
  points: [
    { id: 18, position: { top: '27%', left: '17%' } },
    { id: 19, position: { top: '27%', left: '70%' } },
    { id: 20, position: { top: '35%', left: '17%' } },
    { id: 21, position: { top: '35%', left: '72%' } },
  ]
}

export default BacksideTestModel;
