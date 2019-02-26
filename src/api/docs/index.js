import express, { Router } from 'express'
import path from 'path';

const router = new Router()

router.use(express.static(path.join(__dirname, '../../../docs')))
router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../../../docs/index.html')))

export default router
