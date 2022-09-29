import Widgets from "./widgets";
import Copyright from "./copyright";
import { footer } from "./data";
const { widgets, payment } = footer;

const Footer: React.FC = () => (
  <footer className="w-full bg-white flex flex-col mt-9 justify-center border-b-4 border-heading md:mt-11 lg:mt-16 3xl:mt-20 pt-2.5 lg:pt-10 2xl:pt-2">
    <Widgets widgets={widgets} />
    <Copyright payment={payment} />
  </footer>
);

export default Footer;
// border-b-4 bg-white w-full justify-center border-heading  mt-9 