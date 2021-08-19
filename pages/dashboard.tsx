import { useContext } from "react";
import { Can } from "../components/Can";
import { AuthContexts } from "../contexts/AuthContexts";
import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContexts);

  return (
    <>
      <h1>Olá, {user?.email}</h1>

      <button onClick={signOut}>Sair</button>

      <Can permissions={["metrics.list"]}>
        <div>Métricas</div>
      </Can>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
