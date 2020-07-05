import express from 'express'
const router = express.Router()

// Add Controllers & Validators
import Controller from '../controllers/sample'
import Validator  from '../validators/sample'
// import { checkAuth }  from '../services/checkAuth'


// (action)             (verb)    (URI)
// create:              POST      - /samples
// list:                GET       - /samples
// details:             GET       - /samples/:sampleId
// update:              PUT       - /samples/:sampleId
// delete:              DELETE    - /samples/:sampleId
// do something else:   POST      - /samples/:sampleId/someOtherActionType


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
 *          description: A sample schema
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
 *      summary: Get list of all Samples
 *      tags: [Samples]
 *      responses:
 *        "200":
 *          description: Gets a list of samples as an array of objects
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Sample'
 */
router.route('').get(Validator.list, Controller.list)


/**
 * @swagger
 * path:
 *  /samples/{sampleId}:
 *    get:
 *      summary: Sample Details
 *      tags: [Samples]
 *      parameters:
 *        - name: sampleId
 *          in: path
 *          description: Sample ID
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: Gets a sample's details
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Sample'
 */
router.route('/:sampleId').get(Validator.details, Controller.details)


/**
 * @swagger
 * path:
 *  /samples/{sampleId}:
 *    put:
 *      summary: Sample Update
 *      tags: [Samples]
 *      parameters:
 *        - name: sampleId
 *          in: path
 *          description: Sample ID
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: Admin can update a sample
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Sample'
 */
router.route('/:sampleId').put(Validator.update, Controller.update)
// router.route('/:sampleId').patch(Validator.update, Controller.update)


/**
 * @swagger
 * path:
 *  /samples/{sampleId}:
 *    delete:
 *      summary: Delete Sample
 *      tags: [Samples]
 *      parameters:
 *        - name: sampleId
 *          in: path
 *          description: Sample ID
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: Admin can delete a sample [soft delete]
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Sample'
 */
router.route('/:sampleId').delete(Validator.delete, Controller.delete)

export default router
