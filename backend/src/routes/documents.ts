import express from 'express';
import multer from 'multer';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from './auth';
import { body, query, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/zip',
      'application/x-zip-compressed'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Get all documents
router.get('/', authenticateToken, [
  query('projectId').optional().isString(),
  query('category').optional().isIn(['DRAWING', 'SPECIFICATION', 'CONTRACT', 'PHOTO', 'REPORT', 'PLAN', 'PERMIT', 'OTHER']),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId, category, search } = req.query;

    let where: any = {};

    if (projectId) {
      where.projectId = projectId as string;
    }

    if (category) {
      where.documentType = category as string;
    }

    if (search) {
      where.name = {
        contains: search as string,
        mode: 'insensitive'
      };
    }

    const documents = await prisma.projectDocument.findMany({
      where,
      include: {
        project: {
          select: { id: true, name: true }
        },
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      orderBy: { uploadedAt: 'desc' }
    });

    res.json({
      success: true,
      data: documents
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Upload document
router.post('/upload', authenticateToken, upload.single('file'), [
  body('projectId').isString().notEmpty(),
  body('documentType').isIn(['DRAWING', 'SPECIFICATION', 'CONTRACT', 'PHOTO', 'REPORT', 'PLAN', 'PERMIT', 'OTHER'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { projectId, documentType } = req.body;

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create document record
    const document = await prisma.projectDocument.create({
      data: {
        name: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        documentType: documentType || 'OTHER',
        projectId,
        uploadedById: req.user.userId
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    });

  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Get document by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.projectDocument.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true }
        },
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      success: true,
      data: document
    });

  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Delete document
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.projectDocument.findUnique({
      where: { id }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check if user has permission to delete (owner or admin)
    if (document.uploadedById !== (req.user as any).userId && (req.user as any).role !== 'ADMIN') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await prisma.projectDocument.delete({
      where: { id }
    });

    // TODO: Delete physical file from filesystem

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export { router as documentsRouter };