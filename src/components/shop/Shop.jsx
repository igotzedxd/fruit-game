import { useState, useEffect, useContext } from "react";
import styles from "./shop.module.css";
import { FruitContext } from "../../context/FruitContext"; // Ensure this path is correct

function Shop() {
  const { items, itemCosts, handlePurchase } = useContext(FruitContext);

  return (
    <div className={styles.container}>
      <p>Shop</p>
      <div className={styles.items}>
        {items.map((item) => (
          <div key={item.id} className={styles.item} onClick={() => handlePurchase(item)}>
            <img src={item.src} alt={item.name} />
            <div className={styles.info}>
              <p>{item.name}</p>
              <p>
                {" "}
                {item.type === "clickDamage" ? "DMG" : "DPS"} {item.value}
              </p>
              <p>{itemCosts[item.id - 1]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
