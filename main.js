import ExcelController from './controllers/app.js';
import ExcelModel from './models/app.js';
import ExcelView from './views/app.js';

// Initialize MVC components
const model = new ExcelModel();
const view = new ExcelView();
const controller = new ExcelController(model, view);

// For debugging: expose controller to window
window.app = controller;