import { useContext, useState } from "react";
import { FruitContext } from "../../context/FruitContext"; // Ensure this path is correct
import styles from "./activeFruit.module.css";

const ActiveFruit = () => {
  const { timeLeft, shake, activeFruit, handleFruitClick } = useContext(FruitContext);
  const [smallFruits, setSmallFruits] = useState([]);

  const createFlyingFruit = () => {
    const randomX = (Math.random() - 0.5) * 4000; // Range from -2000px to 2000px
    const randomY = (Math.random() - 0.5) * 4000; // Range from -2000px to 2000px
    const id = Math.random().toString(36).slice(2, 11);

    const newFlyingFruit = (
      <img
        key={id}
        src={activeFruit.src}
        alt={activeFruit.fruit}
        className={styles.smallerFruit}
        style={{ "--random-x": `${randomX}px`, "--random-y": `${randomY}px` }}
        onAnimationEnd={() => removeFlyingFruit(id)}
      />
    );

    setSmallFruits((prev) => [...prev, newFlyingFruit]);
  };

  const removeFlyingFruit = (id) => {
    setSmallFruits((prev) => prev.filter((fruit) => fruit.key !== id));
  };

  const handleFruitClickWithAnimation = (isDps) => {
    handleFruitClick(isDps);
    createFlyingFruit();
  };

  if (!activeFruit) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.fruits}>
      <div className="timer">Time left: {timeLeft} seconds</div>

      <h2>{Math.floor(activeFruit.counter)}</h2>
      {activeFruit && (
        <>
          <img
            className={`${shake ? styles.shake : null} ${styles.fruit}`}
            value={activeFruit.type}
            onClick={(e) => handleFruitClickWithAnimation(false)}
            src={activeFruit.src}
            alt={activeFruit.fruit}
          />
          {smallFruits}
        </>
      )}
      <h3>{activeFruit.fruit.toUpperCase()}</h3>
    </div>
  );
};

export default ActiveFruit;
