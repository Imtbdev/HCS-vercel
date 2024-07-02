import { auth } from "@/auth";
import UserCard from "@/components/dashboard/UserCard";

export default async function SettingsPage() {
  const session = await auth();

  const userData = session?.user.userInfo;

  return (
    <div>
      <UserCard user={userData} />
    </div>
  );
}
