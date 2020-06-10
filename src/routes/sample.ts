import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/sample'
import Validator  from '../validators/sample'

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
router.route('').post(Validator.create, Controller.create)


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
router.route('').get(Validator.list, Controller.list)

router.route('/:sampleId').get(Validator.details, Controller.details)
router.route('/:sampleId').put(Validator.update, Controller.update)
// router.route('/:sampleId').patch(Validator.update, Controller.update)
router.route('/:sampleId').delete(Validator.delete, Controller.delete)

export default router
