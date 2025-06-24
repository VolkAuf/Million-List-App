import { Router } from "express";
import { getItem, getSelected, postSelectById, postReorderItems } from "@/controllers/itemController";

const router = Router();

/**
 * @openapi
 * /items:
 *   get:
 *     summary: Получить список элементов с пагинацией, поиском и сортировкой
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Смещение начала выборки
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Кол-во элементов
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Поисковый запрос по имени
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
 *     summary: Выбрать или снять выбор с элемента
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: number
 *                 description: ID элемента
 *     responses:
 *       200:
 *         description: Успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 selectedCount:
 *                   type: integer
 *       400:
 *         description: Неверный ID
 */
router.post("/select", postSelectById);

/**
 * @openapi
 * /items/selected:
 *   get:
 *     summary: Получить список выбранных ID элементов
 *     responses:
 *       200:
 *         description: Успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 selectedIds:
 *                   type: array
 *                   items:
 *                     type: integer
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
 *             required:
 *               - ids
 *               - isQuery
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               isQuery:
 *                 type: boolean
 *                 description: True — сортировка результатов поиска, False — сортировка основного списка
 *     responses:
 *       200:
 *         description: Успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Ошибка валидации массива ID
 */
router.post("/reorder", postReorderItems);

export default router;
