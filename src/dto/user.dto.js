const { z } = require("zod")

const createUserSchema = z.object({

  name: z.string().min(3).max(20),
  email: z.string().email().transform(val => val.toLowerCase()).optional(),
  phone: z.string().length(10).optional(),
  password: z.string().min(4).max(10),
  role: z.enum(['admin', 'staff', 'supplier', 'driver']).default('staff')

}).strict().refine(data => data.email || data.phone, {
  message: 'At least one of phone or email is required',
  path: ['phone']
})

const updateUserSchema = z.object({

  name: z.string().min(3).max(20).optional(),
  email: z.string().email().transform(val => val.toLowerCase()).optional(),
  phone: z.string().length(10).optional(),
  active: z.boolean().optional()

}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be updated',
  path: []
})

const loginUserSchema = z.object({

  email: z.string().email().transform(val => val.toLowerCase()).optional(),
  phone: z.string().length(10).optional(),
  password: z.string()
  
}).strict().refine(data => data.email || data.phone, {
  message: 'At least one of phone or email is required',
  path: ['phone']
})

const adminUserUpdateSchema = z.object({
  
  name: z.string().min(3).max(20).optional(),
  email: z.string().email().transform(val => val.toLowerCase()).optional(),
  phone: z.string().length(10).optional(),
  role: z.enum(['admin', 'staff', 'supplier', 'driver']).optional(),
  shift: z.enum(['morning', 'evening', 'night']).optional(),
  wagePerHour: z.number().optional(),
  hoursThisMonth: z.number().optional(),
  extraShift: z.number().optional(),
  active: z.boolean().optional(),

}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be updated',
  path: []
})

const passwordSchema = z.object({
  password: z.string().min(4).max(15)
}).strict()

module.exports = {
  createUserSchema,
  updateUserSchema,
  loginUserSchema,
  adminUserUpdateSchema,
  passwordSchema
}