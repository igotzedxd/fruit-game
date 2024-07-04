import { useContext } from "react";
import { FruitContext } from "../../context/FruitContext"; // Ensure this path is correct
import styles from "./sidebar.module.css";

function Sidebar() {
  const { fruits, totalCount } = useContext(FruitContext);

  return (
    <div className={styles.container}>
      <p>Total: {Math.floor(totalCount)}</p>
      {fruits.map((fruit) => (
        <div key={fruit.id} className={styles.fruit}>
          <img src={fruit.src} alt={fruit.fruit} />
          <p className={styles.dash}>-</p>
          <p className={styles.count}>{Math.floor(fruit.counter)}</p>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
