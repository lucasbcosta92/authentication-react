import { useContext } from "react";
import { AuthContexts } from "../contexts/AuthContexts";

export default function Dashboard() {
  const { user } = useContext(AuthContexts);

  return <h1>Olá, {user?.email}</h1>;
}
