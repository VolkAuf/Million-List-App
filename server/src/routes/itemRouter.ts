import { Router } from "express";
import { getItem, getSelected, postSelectById, postReorderItems } from "@/controllers/itemController";

const router = Router();

/**
 * @openapi
 * /items:
 *   get:
 *     summary: Получить список элементов с пагинацией и поиском
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Сдвиг начала выборки (по умолчанию 0)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Кол-во элементов (по умолчанию 20)
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Поиск по имени
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 total:
 *                   type: integer
 */
router.get("/", getItem);

/**
 * @openapi
 * /items/select:
 *   post:
 *     summary: Выбрать или снять выбор с элементов
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               selected:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/select", postSelectById);

/**
 * @openapi
 * /items/selected:
 *   get:
 *     summary: Получить список выбранных элементов
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/selected", getSelected);

/**
 * @openapi
 * /items/reorder:
 *   post:
 *     summary: Изменить порядок элементов (Drag&Drop)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/reorder", postReorderItems);

export default router;
