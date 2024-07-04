import React, { createContext, useState, useEffect, useRef } from "react";
import fruitsData from "../data/fruits.json"; // Adjust the path if necessary

const FruitContext = createContext();

// Item data
const items = [
  {
    id: 1,
    name: "Basic Knife",
    type: "clickDamage",
    value: 1,
    cost: 10,
    src: "/assets/knife1.png",
  },
  {
    id: 2,
    name: "Chef's Knife",
    type: "clickDamage",
    value: 3,
    cost: 30,
    src: "/assets/knife2.png",
  },
  {
    id: 3,
    name: "Santoku Knife",
    type: "clickDamage",
    value: 5,
    cost: 60,
    src: "/assets/knife3.png",
  },
  { id: 4, name: "Sous Chef", type: "dps", value: 1, cost: 20, src: "/assets/souschef.png" },
  { id: 5, name: "Head Chef", type: "dps", value: 3, cost: 50, src: "/assets/headchef.webp" },
  { id: 6, name: "Master Chef", type: "dps", value: 5, cost: 100, src: "/assets/masterchef.png" },
];

const priceMultiplier = 1.15; // Define the price multiplier

const selectRandomItem = (items) => {
  const randomValue = Math.random() * items.length;
  return items[Math.floor(randomValue)];
};

const colorMappings = [
  { backgroundColor: "#FF5733" }, // red
  { backgroundColor: "#33FF57" }, // green
  { backgroundColor: "#3357FF" }, // blue
  { backgroundColor: "#FFFF33" }, // yellow
  { backgroundColor: "#FF33FF" }, // pink
  { backgroundColor: "#FFA500" }, // orange
  { backgroundColor: "#800080" }, // purple
  { backgroundColor: "#00BFFF" }, // deep sky blue
  { backgroundColor: "#FF69B4" }, // hot pink
  { backgroundColor: "#FFD700" }, // gold
];

const FruitProvider = ({ children }) => {
  const initialFruits = () => {
    const savedFruits = localStorage.getItem("fruits");
    return savedFruits
      ? JSON.parse(savedFruits)
      : fruitsData.map((fruit) => ({ ...fruit, counter: 0 }));
  };

  const initialActiveFruit = () => {
    const savedActiveFruit = localStorage.getItem("activeFruit");
    if (savedActiveFruit) {
      return JSON.parse(savedActiveFruit);
    } else {
      const newActiveFruit = selectRandomItem(fruitsData);
      localStorage.setItem("activeFruit", JSON.stringify({ ...newActiveFruit, counter: 0 }));
      return { ...newActiveFruit, counter: 0 };
    }
  };

  const initialTimeLeft = () => {
    const savedTimeLeft = localStorage.getItem("timeLeft");
    return savedTimeLeft ? JSON.parse(savedTimeLeft) : 60;
  };

  const [fruits, setFruits] = useState(initialFruits);
  const [shake, setShake] = useState(false);
  const [totalCount, setTotalCount] = useState(() =>
    fruits.reduce((sum, fruit) => sum + fruit.counter, 0)
  );
  const [activeFruit, setActiveFruit] = useState(initialActiveFruit);
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const timeLeftRef = useRef(timeLeft);

  const [clickDamage, setClickDamage] = useState(
    JSON.parse(localStorage.getItem("clickDamage")) || 1
  );
  const [dps, setDps] = useState(JSON.parse(localStorage.getItem("dps")) || 0);
  const [inventory, setInventory] = useState(JSON.parse(localStorage.getItem("inventory")) || []);
  const [itemCosts, setItemCosts] = useState(
    JSON.parse(localStorage.getItem("itemCosts")) || items.map((item) => item.cost)
  );

  const handlePurchase = (item) => {
    const itemIndex = items.findIndex((i) => i.id === item.id);
    const currentCost = itemCosts[itemIndex];

    if (totalCount >= currentCost) {
      setTotalCount(totalCount - currentCost);
      if (item.type === "clickDamage") {
        const newClickDamage = clickDamage + item.value;
        setClickDamage(newClickDamage);
        localStorage.setItem("clickDamage", JSON.stringify(newClickDamage));
        console.log("New clickDamage after purchase:", newClickDamage);
      } else if (item.type === "dps") {
        const newDps = dps + item.value;
        setDps(newDps);
        localStorage.setItem("dps", JSON.stringify(newDps));
        console.log("New dps after purchase:", newDps);
      }
      setInventory([...inventory, item]);

      // Update item cost
      const newCosts = [...itemCosts];
      newCosts[itemIndex] = Math.ceil(currentCost * priceMultiplier);
      setItemCosts(newCosts);
      localStorage.setItem("itemCosts", JSON.stringify(newCosts));
    }
  };

  const applyColors = () => {
    const randomIndex = Math.floor(Math.random() * colorMappings.length);
    document.documentElement.style.setProperty(
      "--background-color",
      colorMappings[randomIndex].backgroundColor
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTimeLeft = prev - 1;
        timeLeftRef.current = newTimeLeft;
        if (newTimeLeft <= 0) {
          const newActiveFruit = selectRandomItem(fruitsData);
          setActiveFruit({ ...newActiveFruit, counter: 0 });
          localStorage.setItem("activeFruit", JSON.stringify({ ...newActiveFruit, counter: 0 }));
          applyColors();
          localStorage.setItem("timeLeft", JSON.stringify(60));
          return 60;
        } else {
          localStorage.setItem("timeLeft", JSON.stringify(newTimeLeft));
          return newTimeLeft;
        }
      });
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const dpsInterval = setInterval(() => {
      if (dps > 0) {
        handleFruitClick(true); // Apply DPS increment
      }
    }, 1000); // DPS updates every second
    return () => clearInterval(dpsInterval);
  }, [dps]);

  useEffect(() => {
    localStorage.setItem("fruits", JSON.stringify(fruits));
  }, [fruits]);

  const shakeIt = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleFruitClick = (isDps = false) => {
    const increment = isDps ? dps : clickDamage;
    console.log("Increment value:", increment);
    console.log("Click damage:", clickDamage);
    console.log("DPS:", dps);

    // Update the total count and active fruit's counter
    setTotalCount((prevTotalCount) => prevTotalCount + increment);

    setFruits((prevFruits) => {
      const updatedFruits = prevFruits.map((fruit) =>
        fruit.id === activeFruit.id ? { ...fruit, counter: fruit.counter + increment } : fruit
      );
      localStorage.setItem("fruits", JSON.stringify(updatedFruits));
      return updatedFruits;
    });

    setActiveFruit((prevActiveFruit) => {
      const updatedActiveFruit = {
        ...prevActiveFruit,
        counter: prevActiveFruit.counter + increment,
      };
      localStorage.setItem("activeFruit", JSON.stringify(updatedActiveFruit));
      return updatedActiveFruit;
    });
  };

  return (
    <FruitContext.Provider
      value={{
        items,
        itemCosts,
        handlePurchase,
        fruits,
        shake,
        totalCount,
        activeFruit,
        timeLeft,
        handleFruitClick,
      }}
    >
      {children}
    </FruitContext.Provider>
  );
};

export { FruitContext, FruitProvider };
