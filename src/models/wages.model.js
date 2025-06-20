/**
 * Wages/Payroll Model Fields
 *
 * userId        : ObjectId   // Reference to user
 * month         : Date       // Month of payroll
 * hoursWorked   : number     // Calculated from shifts
 * totalSalary   : number     // Computed from wage/hour
 * overworked    : boolean    // True if exceeded healthy hours
 * calculatedAt  : Date       // Payroll run date
 */

const mongoose = require('mongoose')

const wageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  month: {
    type: Date,
    default: Date.now()
  },

  hoursWorked: {
    type: Number,
    default: 0
  },

  totalSalary: {
    type: Number,
    required: true,
    default: 0
  },

  overworked: {
    type: Boolean,
    default: false
  },

  calculatedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true })

const wageModel = mongoose.model('Wage', wageSchema)
module.exports = wageModel
