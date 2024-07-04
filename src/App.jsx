import "./App.css";
import { FruitProvider } from "./context/FruitContext"; // Ensure this path is correct
import ActiveFruit from "./components/activeFruit/ActiveFruit";
import Sidebar from "./components/sidebar/Sidebar";
import Shop from "./components/shop/Shop";

function App() {
  return (
    <FruitProvider>
      <div className="content">
        <Sidebar />
        <ActiveFruit />
        <Shop />
      </div>
    </FruitProvider>
  );
}

export default App;
