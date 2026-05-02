/**
 * Primitivos semánticos. No usan branded types intencionalmente: el costo de
 * fricción supera al beneficio (a diferencia de los IDs, donde mezclarlos
 * tiene impacto real).
 */

/** Timestamp ISO 8601 con timezone. Ej: `"2026-05-02T18:30:00.000Z"`. */
export type ISODateTime = string;

/** Fecha sin hora, formato `YYYY-MM-DD`. Ej: `"2026-05-02"`. */
export type ISODate = string;

/**
 * Cantidad de dinero almacenada en **centavos enteros**.
 * Ej: `109.50 MXN` se guarda como `10950`.
 *
 * Razón: el punto flotante en JS produce errores acumulativos al sumar
 * (`0.1 + 0.2 !== 0.3`). Con enteros eso no ocurre.
 */
export type AmountCents = number;

/** Códigos ISO 4217 de moneda soportadas. Por ahora solo MXN. */
export type CurrencyCode = 'MXN';
