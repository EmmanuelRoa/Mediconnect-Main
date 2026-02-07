import AppRouter from "./router/AppRouter";
import MCLoadingSpinner from "@/shared/components/MCLoadingSpinner";

function App() {
  return (
    <>
      <MCLoadingSpinner />
      <AppRouter />
    </>
  );
}

export default App;
