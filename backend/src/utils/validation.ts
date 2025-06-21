import Joi from 'joi';

export const authValidation = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    role: Joi.string().valid('admin', 'manager', 'inspector', 'viewer').default('viewer')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required()
  })
};

export const projectValidation = {
  create: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    status: Joi.string().valid('planning', 'active', 'on-hold', 'completed', 'cancelled').default('planning'),
    address: Joi.string().max(200),
    clientName: Joi.string().max(100),
    projectManager: Joi.string().uuid(),
    budget: Joi.number().positive()
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().max(500),
    startDate: Joi.date(),
    endDate: Joi.date(),
    status: Joi.string().valid('planning', 'active', 'on-hold', 'completed', 'cancelled'),
    address: Joi.string().max(200),
    clientName: Joi.string().max(100),
    projectManager: Joi.string().uuid(),
    budget: Joi.number().positive()
  })
};

export const inspectionValidation = {
  create: Joi.object({
    projectId: Joi.string().uuid().required(),
    type: Joi.string().valid('quality', 'safety', 'progress', 'defect').required(),
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().max(1000),
    location: Joi.string().max(200),
    status: Joi.string().valid('pending', 'in-progress', 'completed', 'failed').default('pending'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
    assignedTo: Joi.string().uuid(),
    dueDate: Joi.date(),
    photos: Joi.array().items(Joi.string()),
    checklist: Joi.array().items(
      Joi.object({
        item: Joi.string().required(),
        status: Joi.string().valid('pass', 'fail', 'na').required(),
        notes: Joi.string().max(500)
      })
    )
  })
};
