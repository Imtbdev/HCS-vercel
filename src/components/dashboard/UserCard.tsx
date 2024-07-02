import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const UserCard = ({ user }: any) => {
  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-md  shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-4">
          <CardTitle className="text-lg font-semibold">Ваш профиль</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ul className="space-y-2 text-base">
            <li>
              <span className="font-medium">Имя пользователя:</span>{" "}
              {user.username}
            </li>
            <li>
              <span className="font-medium">ФИО:</span> {user.fullname}
            </li>
            <li>
              <span className="font-medium">Почта:</span> {user.email}
            </li>
            <li>
              <span className="font-medium">Мобильный телефон:</span>{" "}
              {user.phone}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCard;
