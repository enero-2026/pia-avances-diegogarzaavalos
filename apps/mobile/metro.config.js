// Metro config para Expo SDK 55 en monorepo pnpm sobre Windows.
//
// Por qué este archivo es complejo:
// - Sin watchman (que no se instala en Windows por defecto), Metro usa
//   `fs.watch` de Node, que en Windows con un monorepo grande + symlinks
//   de pnpm colapsa silenciosamente con:
//     "Failed to construct transformer: Failed to start watch mode."
//     "TypeError: Cannot read properties of undefined (reading 'exists')
//      at DependencyGraph.doesFileExist"
//   Aquí limitamos qué carpetas watchamos para no ahogar al watcher.
//
// - pnpm guarda los packages reales en `node_modules/.pnpm/<pkg>@<ver>/`
//   y crea symlinks. Metro debe poder seguir esos symlinks (lo hace por
//   defecto en SDK 53+) y sus paquetes deben ser singletons (react,
//   react-native, expo-router) para evitar "Invalid hook call".

const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// NOTA: Expo SDK 55 con `getDefaultConfig` ya autolinkea TODOS los
// `packages/*` del monorepo y `node_modules` raíz al `watchFolders`.
// NO añadir manualmente `monorepoRoot` porque entonces Metro intenta
// watchar la raíz Y cada package individualmente, duplicando trabajo y
// ahogando al watcher de Node en Windows.

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Forzar singletons para libs que NO toleran múltiples instancias.
// Sin esto, packages/* podrían resolver su propia copia y romper hooks.
const singletons = ['react', 'react-native', 'expo', 'expo-router'];
config.resolver.extraNodeModules = singletons.reduce((acc, name) => {
  acc[name] = path.resolve(projectRoot, 'node_modules', name);
  return acc;
}, {});

// Exclusiones del watcher: en Windows sin watchman, vigilar todo el
// monorepo (incluyendo `node_modules` con 1300+ paquetes y sus archivos
// nativos) ahoga al `fs.watch` de Node y dispara:
//   "Failed to construct transformer: Failed to start watch mode."
// Bloqueamos lo más pesado y que NUNCA necesita hot-reload en runtime.
const blockedPatterns = [
  // Carpetas nativas autogeneradas por `expo prebuild` (no son código JS).
  /apps[/\\]mobile[/\\]android[/\\].*/,
  /apps[/\\]mobile[/\\]ios[/\\].*/,
  // NOTA: NO bloqueamos `packages/*/dist/` aunque cambien con poca
  // frecuencia, porque los `package.json` de los packages declaran
  // `exports` apuntando a `./dist/index.js` y Metro debe poder leer ese
  // archivo. Si los bloqueamos, Metro tira:
  //   "Unable to resolve @balancehogar/schemas from ..."
  // Si en el futuro los `package.json` apuntan a `./src/index.ts`
  // (como ya hace api-client), podemos volver a bloquear `dist/`.
  // Caches y temporales.
  /\.turbo[/\\].*/,
  /\.expo[/\\].*/,
  /\.git[/\\].*/,
  // node_modules anidados profundos (>= 3 niveles): nunca cambian a runtime
  // y son la principal fuente de saturación del watcher.
  /node_modules[/\\].*[/\\]node_modules[/\\].*[/\\]node_modules[/\\].*/,
  // Tests y fixtures dentro de paquetes externos: no los necesitamos.
  /node_modules[/\\][^/\\]+[/\\](?:test|tests|__tests__|spec|__fixtures__)[/\\].*/,
];

config.resolver.blockList = blockedPatterns;

// Misma lista para el watcher (no le pidamos vigilar lo que ya bloqueamos).
config.watcher = {
  ...(config.watcher ?? {}),
  additional: {
    ...(config.watcher?.additional ?? {}),
    ignored: blockedPatterns,
  },
  // Health check tolerante: si no hay actividad en X ms, no asumir que
  // el watcher murió. Esto evita el "Failed to start watch mode" inicial.
  healthCheck: {
    enabled: false,
  },
};

module.exports = config;
