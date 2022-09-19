import { Sidebar } from '../main';

export const SIDES: Sidebar[] = [
  {
    menu: '전체현황',
    route: 'dashboard',
    emt: '../../../assets/images/dashboardicons/전체현황.svg',
    ngif: [''],
  },
  {
    menu: '회원관리',
    route: 'user',
    emt: '../../../../assets/images/dashboardicons/회원관리.svg',
    ngif: [''],
  },
  {
    menu: '고객사관리',
    route: 'client',
    emt: '../../../assets/images/dashboardicons/고객사관리.svg',
    ngif: ['hyper'],
  },
  {
    menu: '기기관리',
    route: 'device',
    emt: '../../../assets/images/dashboardicons/기기관리.svg',
    ngif: [''],
  },
  {
    menu: '전체감지',
    route: 'alldetection',
    emt: '../../../assets/images/dashboardicons/전체감지.svg',
    ngif: [''],
  },
];
