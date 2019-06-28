/**
 * Валидация наличия аргумента
 * @param name
 */
export function missingArgument(name) {
    throw new Error(`Missing argument '${name}'`);
}