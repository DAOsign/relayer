import { Router } from 'express';
import HelloWorld from '../controllers/helloWorld';

const router = Router();

const helloWorldController: HelloWorld = new HelloWorld();

router.route('/isAlive').get(helloWorldController.isAlive);

export default router;