import { ItemList } from "@/components/ItemList.tsx";

function App() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center px-4">
      <h1 className="text-2xl font-bold text-center py-4">Items</h1>
      <ItemList />
    </main>
  );
}

export default App;
