import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  category: string;
}

interface FavoritesState {
  items: FavoriteProduct[];
  count: number;
}

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: FavoriteProduct }
  | { type: 'REMOVE_FAVORITE'; payload: { id: number } }
  | { type: 'LOAD_FAVORITES'; payload: FavoriteProduct[] };

const FavoritesContext = createContext<{
  state: FavoritesState;
  addFavorite: (product: FavoriteProduct) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (product: FavoriteProduct) => void;
} | undefined>(undefined);

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex > -1) {
        return state; // Already in favorites
      }
      
      return {
        items: [...state.items, action.payload],
        count: state.count + 1
      };
    }

    case 'REMOVE_FAVORITE': {
      return {
        items: state.items.filter(item => item.id !== action.payload.id),
        count: state.count - 1
      };
    }

    case 'LOAD_FAVORITES': {
      return {
        items: action.payload,
        count: action.payload.length
      };
    }

    default:
      return state;
  }
};

const initialState: FavoritesState = {
  items: [],
  count: 0
};

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('chamly-favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        dispatch({ type: 'LOAD_FAVORITES', payload: parsedFavorites });
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chamly-favorites', JSON.stringify(state.items));
  }, [state.items]);

  const addFavorite = (product: FavoriteProduct) => {
    dispatch({ type: 'ADD_FAVORITE', payload: product });
  };

  const removeFavorite = (id: number) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: { id } });
  };

  const isFavorite = (id: number): boolean => {
    return state.items.some(item => item.id === id);
  };

  const toggleFavorite = (product: FavoriteProduct) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const value = {
    state,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
