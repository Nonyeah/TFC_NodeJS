import { mobileListInit } from "./mobile";
import {
  navblocks,
  showNavBlock,
  topNavLinks,
  hideNavBlock,
  slideNavMenu,
} from "./header";
//import { toggleBottomTabInit } from "./footer";


for (let elem of topNavLinks) {
  elem.addEventListener("click", showNavBlock);
};

for (let elem of navblocks) {
  elem.addEventListener("mouseleave", hideNavBlock);
};

slideNavMenu();
//toggleBottomTabInit();
mobileListInit();

