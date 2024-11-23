import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/sample'
import Validator from '../validators/sample'
import { checkToken, checkRole } from '../middlewares/check_auth'

// (action)             (verb)    (URI)
// create:              POST      - /samples
// list:                GET       - /samples
// details:             GET       - /samples/:sampleId
// update:              PUT       - /samples/:sampleId
// delete:              DELETE    - /samples/:sampleId
// a secure action:     POST      - /samples/:sampleId/secure-action

// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * paths:
 *   /samples/:
 *     post:
 *       summary: Create a new sample
 *       tags: [Samples]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sample'
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('').post(Validator.create, Controller.create)

/**
 * @openapi
 * paths:
 *   /samples/:
 *     get:
 *       summary: Get list of all Samples
 *       tags: [Samples]
 *       responses:
 *         "200":
 *           description: Gets a list of samples as an array of objects
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     description: Response Status
 *                   result:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         list:
 *                           $ref: '#/components/schemas/Sample'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 */
router.route('').get(Validator.list, Controller.list)

/**
 * @openapi
 * paths:
 *   /samples/{sampleId}:
 *     get:
 *       summary: Sample Details
 *       tags: [Samples]
 *       parameters:
 *         - name: sampleId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:sampleId').get(Validator.details, Controller.details)

/**
 * @openapi
 * paths:
 *   /samples/{sampleId}:
 *     put:
 *       summary: Sample Update
 *       tags: [Samples]
 *       parameters:
 *         - name: sampleId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:sampleId').put(Validator.update, Controller.update)
// router.route('/:sampleId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * paths:
 *   /samples/{sampleId}:
 *     delete:
 *       summary: Delete Sample
 *       tags: [Samples]
 *       parameters:
 *         - name: sampleId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router.route('/:sampleId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * paths:
 *   /samples/{sampleId}/secure-action:
 *     post:
 *       summary: Secure Action For Sample
 *       tags: [Samples]
 *       parameters:
 *         - name: sampleId
 *           in: path
 *           description: Sample ID
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           $ref: '#/components/responses/Success'
 *         "400":
 *           $ref: '#/components/responses/BadRequest'
 *         "401":
 *           $ref: '#/components/responses/Unauthorized'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
router
  .route('/:sampleId/secure-action')
  .post(checkToken, checkRole(), Validator.secureAction, Controller.secureAction)

export default router
