import { readFileSync } from "fs";

/**
 * Валидация наличия аргумента.
 * @param name
 */
export function missingArgument(name) {
    throw new Error(`Missing argument '${name}'`);
};

/**
 * Стрелочная функция для построения пути к паблик файлам.
 * @param filename 
 */
export const buildPath = (filename = missingArgument("filename")) => `${process.cwd()}/public/${filename}.html`;


/**
 * Функция для рендеринга html
 * @param res 
 * @param filename 
 */
export function renderHtml(res = missingArgument("res"), filename, html) {
    let forRender;
    const mimeType = "text/html";
    
    if (filename) {
        const path = buildPath(filename);
        forRender = readFileSync(path);
    }
    if (html) forRender = html;
    
    res.writeHead(200, {
        'Content-Type': mimeType 
    });
    res.write(forRender);
    res.end();
};

/**
 * Функция для редиректа
 * @param res 
 * @param location 
 */
export function redirect(res = missingArgument("res"), location = missingArgument("location")) {
    res.writeHead(307, {
        'Location': location
    });
    res.end();
};

/**
 * Функция для парсинга даты с формы в нативный JS объект
 * @param data 
 */
export function parseHtmlForm(data = missingArgument("data")) {
    const result = {};
    const array = data.split("&");
    for (const item of array) {
        const [key, value] = item.split("=");
        result[key] = value;
    }
    return result;
}