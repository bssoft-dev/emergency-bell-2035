import { Sidebar, Sidefooter } from "./main";

export const SIDES: Sidebar[] = [
    { menu: "전체현황", route: "dashboard", head: "전체현황", emt: "../../assets/images/dashboardicons/전체현황.png", ngif: ["is_hyperuser","customer_code"] },
    { menu: "회원관리", route: "user", head: "회원 관리", emt: "../../assets/images/dashboardicons/회원관리.png", ngif: ["is_hyperuser","customer_code"] },
    { menu: "고객사관리", route: "client", head: "고객사관리", emt: "../../assets/images/dashboardicons/고객사관리.png", ngif: ["is_hyperuser"] },
    { menu: "기기관리", route: "device", head: "기기관리", emt: "../../assets/images/dashboardicons/기기관리.png", ngif: ["is_hyperuser","customer_code"] },
    { menu: "전체감지", route: "alldetection", head: "전체 감지 내역", emt: "../../assets/images/dashboardicons/전체감지.png", ngif: ["is_hyperuser","customer_code"] },
]

export const SIDEFOOTERS: Sidefooter[] = [
    { menu: "알람설정", click: "clickedModal()", href: "javascript:false", emt: "../../assets/images/dashboardicons/작동중.png" },
    { menu: "로그아웃", click: "logout()", href: "", emt: "../../assets/images/dashboardicons/로그아웃.png" },
]