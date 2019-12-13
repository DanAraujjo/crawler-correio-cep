import { Router } from 'express';

import SearchController from './app/controllers/SearchController';

const routes = new Router();

routes.get('/search/:cep', SearchController.show);

export default routes;
