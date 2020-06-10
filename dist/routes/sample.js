"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Add Controllers & Validators
const sample_1 = __importDefault(require("../controllers/sample"));
const sample_2 = __importDefault(require("../validators/sample"));
// ---------------------------------- Define all routes in this microservice ----------------------------------
/**
 * @swagger
 * tags:
 *   name: Samples
 *   description: Sample management
 */
/**
 * @swagger
 * path:
 *  /samples/:
 *    post:
 *      summary: Create a new sample
 *      tags: [Samples]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Sample'
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Sample'
 */
router.route('').post(sample_2.default.create, sample_1.default.create);
/**
 * @swagger
 * path:
 *  /samples/:
 *    get:
 *      summary: Get all samples
 *      tags: [Samples]
 *      responses:
 *        "200":
 *          description: An array of samples
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Sample'
 */
router.route('').get(sample_2.default.list, sample_1.default.list);
router.route('/:sampleId').get(sample_2.default.details, sample_1.default.details);
router.route('/:sampleId').put(sample_2.default.update, sample_1.default.update);
// router.route('/:sampleId').patch(Validator.update, Controller.update)
router.route('/:sampleId').delete(sample_2.default.delete, sample_1.default.delete);
exports.default = router;
