import { InfiltrationTest } from "../types/infiltrationTest.type";

const LeftsideTestModel: InfiltrationTest = {
  id: 'leftside',
  title: 'Verificar lado esquerdo da cabine',
  url: '/main/leftside-test',
  img: '../../../assets/img/left-truck.webp',
  testImg: '../../../assets/img/leftside-test.webp',
  altImg: 'Leftside truck',
  content: 'Verificar vãos da lateral esquerda',
  status: 'pending',
  result: 'OK',
  points: [
    { id: 6, position: { top: '23%', left: '53%' } },
    { id: 7, position: { top: '26%', left: '40%' } },
    { id: 8, position: { top: '30%', left: '16%' } },
    { id: 9, position: { top: '43%', left: '39%' } },
    { id: 10, position: { top: '47%', left: '10%' } },
    { id: 11, position: { top: '49%', left: '68%' } },
  ]
}

export default LeftsideTestModel;
