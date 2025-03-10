import { InfiltrationTest } from "../types/infiltrationTest.type";

const RightsideTestModel: InfiltrationTest = {
  id: 'rightside',
  title: 'Verificar lado direito da cabine',
  url: '/main/rightside-test',
  img: '../../../assets/img/right-truck.webp',
  testImg: '../../../assets/img/rightside-test.webp',
  altImg: 'Rightside truck',
  content: 'Verificar vãos da lateral direita',
  status: 'pending',
  result: 'OK',
  points: [
    { id: 12, position: { top: '23%', left: '37%' } },
    { id: 13, position: { top: '26%', left: '49%' } },
    { id: 14, position: { top: '30%', left: '72%' } },
    { id: 15, position: { top: '41%', left: '49%' } },
    { id: 16, position: { top: '46%', left: '77%' } },
    { id: 17, position: { top: '49%', left: '20%' } },
  ]
}

export default RightsideTestModel;
