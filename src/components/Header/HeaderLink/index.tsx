"use client";
import { NextPage } from "next";
import "./styles.scss";
import { useState } from "react";
import { usePathname } from "next/navigation";

import CustomLogo from "@/components/common/CustomIcons";
import Link from "next/link";

interface Props {
  link: string;
  coloredIcon: string;
  whiteIcon: string;
  linkCTA: string;
}

const HeaderLink: NextPage<Props> = ({
  link,
  coloredIcon,
  whiteIcon,
  linkCTA,
}) => {
  const pathname = usePathname();
  const [changeLogo, setChangeLogo] = useState<boolean>(false);
  return (
    <Link href={link} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setChangeLogo(true)}
        onMouseLeave={() => setChangeLogo(false)}
        className={pathname === link ? "HeaderLink" : "HeaderLink-White"}
      >
        {/* <div className="HeaderLink-Logo">
          <CustomLogo src={changeLogo ? coloredIcon : whiteIcon} />
        </div> */}
        {linkCTA}
      </div>
    </Link>
  );
};

export default HeaderLink;
