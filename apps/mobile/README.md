# BalanceHogar Mobile App

App móvil para gestionar gastos compartidos del hogar, desarrollada con React Native y Expo.

## Características

- Gestión de gastos compartidos entre miembros del hogar
- Categorización de gastos
- Gastos recurrentes con notificaciones
- Adjuntos de comprobantes (fotos)
- Análisis mensual con IA (próximamente)
- Notificaciones push locales

## Tecnologías

- React Native 0.76
- Expo SDK 52+
- TypeScript
- Expo Router (navegación basada en archivos)
- AsyncStorage para persistencia local
- Expo Camera e Image Picker para adjuntos
- Expo Notifications para alertas
- React Native Chart Kit para gráficas

## Estructura del proyecto

```
apps/mobile/
├── app/                    # Páginas y navegación (Expo Router)
│   ├── _layout.tsx        # Layout raíz
│   ├── (tabs)/           # Navegación por tabs
│   │   ├── _layout.tsx   # Configuración de tabs
│   │   ├── index.tsx     # Tab Inicio
│   │   ├── gastos.tsx    # Tab Gastos
│   │   └── miembros.tsx  # Tab Miembros
│   ├── onboarding/       # Flujo de onboarding
│   └── modal/            # Modales
├── components/           # Componentes reutilizables
├── context/             # Context API para estado global
├── hooks/               # Hooks personalizados
├── types/               # Definiciones TypeScript
├── utils/               # Utilidades
├── constants/           # Constantes (categorías, etc.)
└── assets/              # Imágenes, íconos, fuentes
```

## Instalación y ejecución

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Ejecutar en Android
pnpm android

# Ejecutar en iOS
pnpm ios

# Ejecutar en web
pnpm web
```

## Funcionalidades implementadas

### Onboarding

- Creación de residencia con código único
- Unión a residencia existente con código
- Configuración de perfil de miembro

### Gestión de gastos

- Agregar gastos con categorías, montos, fechas
- Adjuntar comprobantes (cámara o galería)
- Gastos recurrentes con frecuencias
- Filtrado por categoría, miembro, mes, estado

### Miembros

- Visualización de miembros activos
- Eliminación de miembros (solo admin)
- Código de invitación para nuevos miembros

### Notificaciones

- Alertas de nuevos gastos
- Recordatorios de gastos recurrentes próximos

### Estado y persistencia

- Estado global con React Context + useReducer
- Persistencia local con AsyncStorage
- Sincronización automática entre componentes

## Próximas funcionalidades

- Integración con API backend
- Análisis mensual con IA
- Sincronización en tiempo real
- Exportación de reportes
- Modo oscuro
- Internacionalización (i18n)

## Desarrollo

El proyecto sigue las mejores prácticas de React Native:

- TypeScript estricto
- Componentes funcionales con hooks
- Separación de lógica de negocio en hooks y utils
- Estado inmutable
- Navegación basada en archivos con Expo Router

## Por qué `app/` separado de `src/`

`expo-router` exige que las **rutas** vivan en `app/`, pero los componentes y la lógica los queremos cerca pero no como rutas. Con esta separación:

- `app/` = solo páginas (delgadas, importan de `src/features/*`).
- `src/features/` = donde vive la lógica reutilizable.

Esto evita que carpetas internas se vuelvan rutas accidentales.

## Por qué `features/` y no `screens/` o `pages/`

Cada feature (auth, expenses, members, dashboard) agrupa lo suyo: componentes, hooks, queries, tipos locales. Es más fácil moverlas o borrarlas que si todo estuviera disperso por tipo de archivo.

## Variables de entorno

Copiar `.env.example` a `.env` y editar. Solo las variables `EXPO_PUBLIC_*` quedan expuestas al cliente.
