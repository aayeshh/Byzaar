// src/StateProvider.js
import React, { createContext, useContext, useReducer } from "react";

export const StateContext = createContext();

// Initial state with products data
export const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  basket: [],
  
  address: {},
  products: [
    {
      _id: 1,
      imageURL: "/placeholder.png",
      price: 19.99,
      rating: 4,
      title: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      features: ["Bluetooth 5.0", "20hrs battery life", "Noise cancellation"],
    },
    {
      _id: 2,
      imageURL: "/placeholder.png",
      price: 99.99,
      rating: 5,
      title: "Smart Watch",
      description: "Advanced smartwatch with health monitoring",
      features: ["Heart rate monitor", "Water resistant", "1-week battery"],
    },
    {
      _id: 3,
      imageURL: "/placeholder.png",
      price: 49.99,
      rating: 3,
      title: "Bluetooth Speaker",
      description: "Portable speaker with rich sound quality",
      features: ["20W output", "IPX7 waterproof", "12hrs playback"],
    },
    {
      _id: 4,
      imageURL: "/placeholder.png",
      price: 199.99,
      rating: 4,
      title: "Gaming Keyboard",
      description: "Mechanical keyboard for professional gamers",
      features: ["RGB lighting", "Mechanical switches", "Anti-ghosting"],
    }
  ]
};

// Reducer function to handle state updates
export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_BASKET":
      // Check if item already exists in basket
      const existingItemIndex = state.basket.findIndex(
        (item) => item.id === action.item.id
      );
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const newBasket = [...state.basket];
        newBasket[existingItemIndex] = {
          ...newBasket[existingItemIndex],
          quantity: newBasket[existingItemIndex].quantity + 1,
        };
        return {
          ...state,
          basket: newBasket,
        };
      } else {
        // Item doesn't exist, add new item with quantity 1
        return {
          ...state,
          basket: [...state.basket, { ...action.item, quantity: 1 }],
        };
      }

    case "REMOVE_FROM_BASKET":
      return {
        ...state,
        basket: state.basket.filter((item) => item.id !== action.id),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        basket: state.basket.map((item) =>
          item.id === action.id
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };

    case "EMPTY_BASKET":
      return {
        ...state,
        basket: [],
      };
    
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
      case "SET_ADDRESS":
        return {
          ...state,
          address: { ...action.item },
        };
  

    default:
      return state;
  }
};

export const StateProvider = ({ children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);