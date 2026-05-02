/**
 * Branded type. Permite distinguir tipos que en runtime son el mismo
 * (string, number) pero conceptualmente son diferentes.
 *
 * Implementado con un literal `__brand: K` (en vez de `unique symbol`) para
 * que el tipo sea **nombrable** desde packages externos. Con `unique symbol`
 * privado, TypeScript se quejaba (TS4023) cuando otros packages derivaban
 * tipos de schemas Zod que producían un `Brand<string, 'X'>`.
 *
 * @example
 * type UserId = Brand<string, 'UserId'>;
 * type PostId = Brand<string, 'PostId'>;
 *
 * function getUser(id: UserId) { ... }
 * const postId: PostId = '...' as PostId;
 * getUser(postId); // ❌ Compile error
 */
export type Brand<TValue, TBrand extends string> = TValue & {
  readonly __brand: TBrand;
};
