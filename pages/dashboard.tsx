import { useContext, useEffect } from "react";
import { Can } from "../components/Can";
import { AuthContexts } from "../contexts/AuthContexts";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useContext(AuthContexts);

  useEffect(() => {
    api
      .get("/me")
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <h1>Olá, {user?.email}</h1>
      <Can permissions={["metrics.list"]}>
        <div>Métricas</div>
      </Can>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/me");

  console.log(response);

  return {
    props: {},
  };
});
