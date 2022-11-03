import Image from "next/image";
import Link from "@components/ui/link";
import cn from "classnames";
import { siteSettings } from "@settings/site-settings";
import LogoBlack from "../../../public/assets/images/logo-black.svg";
import { useContext } from "react";
import { colorsContext } from "@contexts/colors.context";

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  ...props
}) => {
  const { darkTheme } = useContext(colorsContext);

  return (
    <Link
      href={siteSettings.logo.href}
      className={cn("inline-flex focus:outline-none", className)}
      {...props}
    >
      <Image
        src={darkTheme ? siteSettings.logo.url : LogoBlack}
        alt={siteSettings.logo.alt}
        height={siteSettings.logo.height}
        width={siteSettings.logo.width}
        layout="fixed"
        loading="eager"
      />
    </Link>
  );
};

export default Logo;
