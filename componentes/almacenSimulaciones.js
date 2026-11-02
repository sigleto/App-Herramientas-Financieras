const AsyncStorage = require("@react-native-async-storage/async-storage").default;

const SIMULATIONS_KEY = "@finanzas-facil/simulaciones";
const FAVORITES_KEY = "@finanzas-facil/favoritos";
const RECENTS_KEY = "@finanzas-facil/recientes";

async function readJson(key, fallback) {
  const stored = await AsyncStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
}

async function saveSimulation(simulation) {
  const simulations = await readJson(SIMULATIONS_KEY, []);
  const saved = {
    ...simulation,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(
    SIMULATIONS_KEY,
    JSON.stringify([saved, ...simulations])
  );
  return saved;
}

async function getSimulations() {
  return readJson(SIMULATIONS_KEY, []);
}

async function deleteSimulation(id) {
  const simulations = await getSimulations();
  await AsyncStorage.setItem(
    SIMULATIONS_KEY,
    JSON.stringify(simulations.filter((simulation) => simulation.id !== id))
  );
}

async function getFavorites() {
  return readJson(FAVORITES_KEY, []);
}

async function toggleFavorite(route) {
  const favorites = await getFavorites();
  const updated = favorites.includes(route)
    ? favorites.filter((favorite) => favorite !== route)
    : [...favorites, route];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

async function getRecentTools() {
  return readJson(RECENTS_KEY, []);
}

async function addRecentTool(route) {
  const recent = await getRecentTools();
  await AsyncStorage.setItem(
    RECENTS_KEY,
    JSON.stringify([route, ...recent.filter((item) => item !== route)].slice(0, 5))
  );
}

module.exports = {
  saveSimulation,
  getSimulations,
  deleteSimulation,
  getFavorites,
  toggleFavorite,
  getRecentTools,
  addRecentTool,
};
