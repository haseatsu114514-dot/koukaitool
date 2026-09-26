/** BudouX's package entry also pulls its HTML processor and a DOM implementation (linkedom) into client chunks.
 * Import only the parser and the Japanese model instead; the budoux version is pinned in package.json. */
export { Parser } from "../../node_modules/budoux/module/parser.js";
export { model as jaModel } from "../../node_modules/budoux/module/data/models/ja.js";
