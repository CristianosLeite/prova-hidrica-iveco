import { InfiltrationGroup } from "../types/infiltrationGroup.type";

const InfiltrationGroups: { [key: string]: InfiltrationGroup } = {
  'Teto': {
    name: 'Teto',
    points: [
      { id: 1, name: 'Climatizador', value: false },
      { id: 2, name: 'Lado direito', value: false },
      { id: 3, name: 'Lado esquerdo', value: false },
      { id: 4, name: 'Viseira direito', value: false },
      { id: 5, name: 'Viseira esquerdo', value: false }
    ]
  },
  'Lateral esquerda': {
    name: 'Lateral esquerda',
    points: [
      { id: 6, name: 'Porta superior', value: false },
      { id: 7, name: 'Guarnição de porta superior centro', value: false },
      { id: 8, name: 'Vidro fixo', value: false },
      { id: 9, name: 'Pestana', value: false },
      { id: 10, name: 'Guarnição do chicote elétrico da porta', value: false },
      { id: 11, name: 'Portinhola', value: false }
    ]
  },
  'Lateral direita': {
    name: 'Lateral direita',
    points: [
      { id: 12, name: 'Porta superior', value: false },
      { id: 13, name: 'Guarnição de porta superior centro', value: false },
      { id: 14, name: 'Vidro fixo', value: false },
      { id: 15, name: 'Pestana', value: false },
      { id: 16, name: 'Guarnição do chicote elétrico da porta', value: false },
      { id: 17, name: 'Portinhola', value: false }
    ]
  },
  'Teto posterior': {
    name: 'Teto posterior',
    points: [
      { id: 18, name: 'Tampão superior esquerdo', value: false },
      { id: 19, name: 'Tampão superior direito', value: false },
      { id: 20, name: 'Tampão inferior esquerdo', value: false },
      { id: 21, name: 'Tampão inferior direito', value: false }
    ]
  },
  'Para-brisa': {
    name: 'Para-brisa',
    points: [
      { id: 22, name: 'Superior direito', value: false },
      { id: 23, name: 'Superior central', value: false },
      { id: 24, name: 'Superior esquerdo', value: false },
      { id: 25, name: 'Superior direito', value: false },
      { id: 26, name: 'Inferior central', value: false },
      { id: 27, name: 'Inferior esquerdo', value: false }
    ]
  },
  'Cabine frontal': {
    name: 'Cabine frontal',
    points: [
      { id: 28, name: 'Tampão do fronta esquerdo', value: false },
      { id: 29, name: 'Tampão do fronta direito', value: false },
      { id: 30, name: 'Pedaleira', value: false },
      { id: 31, name: 'Reservatório do coolant', value: false },
      { id: 32, name: 'Caixa de ar', value: false },
      { id: 33, name: 'Ar-condicionado', value: false }
    ]
  }
};

export default InfiltrationGroups;
