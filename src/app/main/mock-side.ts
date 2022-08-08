import { Sidebar } from './main';

export const SIDES: Sidebar[] = [
  {
    menu: '전체현황',
    route: 'dashboard',
    head: '전체현황',
    emt: 'assessment',
    ngif: 'customer_code',
  },
  {
    menu: '회원관리',
    route: 'member',
    head: '회원 관리',
    emt: 'assignment_ind',
    ngif: 'customer_code',
  },
  {
    menu: '고객사관리',
    route: 'client',
    head: '고객사관리',
    emt: 'group_work',
    ngif: '',
  },
  {
    menu: '기기관리',
    route: 'device',
    head: '기기관리',
    emt: 'perm_device_information',
    ngif: 'customer_code',
  },
  {
    menu: '전체감지',
    route: 'alldetection',
    head: '전체 감지 내역',
    emt: 'pageview',
    ngif: 'customer_code',
  },
];
