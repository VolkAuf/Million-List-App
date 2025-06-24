import { ItemList } from "./components/ItemList.tsx";

function App() {
  return (
    <main className="min-h-screen">
      <h1 className="text-2xl font-bold text-center py-4">Items</h1>
      <ItemList />
    </main>
  );
}

export default App;
