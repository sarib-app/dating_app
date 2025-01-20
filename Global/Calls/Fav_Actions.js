import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = 'favourites';

export const addFavourite = async (id) => {
  try {
    let favourites = await getFavourites();
    if (!favourites.includes(id)) {
      favourites.push(id);
      await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
    }
  } catch (error) {
    console.error('Error adding favourite:', error);
  }
};

export const removeFavourite = async (id) => {
  try {
    let favourites = await getFavourites();
    favourites = favourites.filter(favId => favId !== id);
    await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
  } catch (error) {
    console.error('Error removing favourite:', error);
  }
};

export const getFavourites = async () => {
  try {
    const favourites = await AsyncStorage.getItem(FAVOURITES_KEY);
    return favourites ? JSON.parse(favourites) : [];
  } catch (error) {
    console.error('Error getting favourites:', error);
    return [];
  }
};

export const isFavourite = async (id) => {
  try {
    const favourites = await getFavourites();
    return favourites.includes(id);
  } catch (error) {
    console.error('Error checking if favourite:', error);
    return false;
  }
};
