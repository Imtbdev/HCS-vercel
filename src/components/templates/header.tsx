import React, { memo } from "react";
import { auth } from "@/auth";
import { HeaderUser } from "@/components/auth/headerUser";

interface IProps {}
export const Header: React.FC<IProps> = async (props) => {
  const {} = props;
  const session = await auth();

  return (
    <header>
      <div>
        {session && session?.user.userInfo.active ? (
          <HeaderUser session={session} />
        ) : (
          <></>
        )}
      </div>
    </header>
  );
};
