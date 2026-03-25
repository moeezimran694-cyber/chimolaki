import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const menuItems = [
  {
    name: "Margherita Paradise",
    description: "Classic Italian pizza with fresh mozzarella, basil, and our secret tomato sauce.",
    price: 1200,
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=800",
    category: "Pizza",
    options: {
      sizes: ["Small", "Medium", "Large"],
      crusts: ["Hand Tossed", "Thin Crust", "Pan Pizza"],
      toppings: ["Extra Cheese", "Mushrooms", "Olives"]
    }
  },
  {
    name: "Spicy Tikka Fusion",
    description: "Tender chicken tikka chunks with onions, green peppers, and spicy Pakistani spices.",
    price: 1500,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
    category: "Pizza",
    options: {
      sizes: ["Small", "Medium", "Large"],
      crusts: ["Hand Tossed", "Thin Crust", "Stuffed Crust"],
      toppings: ["Extra Cheese", "Jalapenos", "Onions"]
    }
  },
  {
    name: "Pepperoni Feast",
    description: "Double layer of premium pepperoni with extra mozzarella cheese.",
    price: 1400,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800",
    category: "Pizza",
    options: {
      sizes: ["Small", "Medium", "Large"],
      crusts: ["Hand Tossed", "Thin Crust"],
      toppings: ["Extra Cheese", "Pepperoni", "Olives"]
    }
  }
];

const deals = [
  {
    title: "Family Feast",
    description: "2 Large Pizzas + 1.5L Drink + Garlic Bread",
    discount: 25,
    code: "FAMILY25",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Midnight Deal",
    description: "1 Medium Pizza + 500ml Drink",
    discount: 15,
    code: "MIDNIGHT15",
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=800"
  }
];

const blogPosts = [
  {
    title: "The Secret to Our Dough",
    content: "We spend 48 hours fermenting our dough to ensure the perfect airy crust every single time...",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800",
    author: "Chef Moeez",
    category: "Kitchen Secrets",
    createdAt: serverTimestamp()
  }
];

async function seed() {
  console.log("Seeding database...");
  
  for (const item of menuItems) {
    await addDoc(collection(db, 'menu_items'), item);
  }
  
  for (const deal of deals) {
    await addDoc(collection(db, 'deals'), deal);
  }
  
  for (const post of blogPosts) {
    await addDoc(collection(db, 'blog'), post);
  }
  
  console.log("Seeding complete!");
}

seed();
