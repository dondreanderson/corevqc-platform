import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all projects
export const getProjects = async (req: Request, res: Response) => {
  try {
    console.log('📋 Fetching projects...');
    
    const projects = await prisma.project.findMany({
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    console.log(`✅ Found ${projects.length} projects`);

    res.json({
      success: true,
      projects
    });

  } catch (error) {
    console.error('❌ Get projects error:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      message: 'Internal server error'
    });
  }
};

// Get single project with full details
export const getProject = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    console.log('📋 Fetching detailed project:', id);

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        documents: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            uploadedAt: 'desc'
          },
          take: 10 // Limit to recent documents
        },
        inspections: {
          include: {
            inspector: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Recent inspections
        },
        ncrs: {
          include: {
            reportedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Recent NCRs
        },
        _count: {
          select: {
            documents: true,
            inspections: true,
            ncrs: true,
            members: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    console.log('✅ Project details loaded:', project.name);

    res.json({
      success: true,
      project
    });

  } catch (error) {
    console.error('❌ Get project error:', error);
    res.status(500).json({
      error: 'Failed to fetch project',
      message: 'Internal server error'
    });
  }
};

// Create new project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, priority = 'MEDIUM' } = req.body;

    console.log('📝 Creating project:', name);

    if (!name) {
      return res.status(400).json({
        error: 'Project name is required'
      });
    }

    // Get the first user as owner (for testing)
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) {
      return res.status(400).json({
        error: 'No users found in database'
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        priority,
        organizationId: firstUser.organizationId,
        ownerId: firstUser.id
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    console.log('✅ Project created:', project.name);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('❌ Create project error:', error);
    res.status(500).json({
      error: 'Failed to create project',
      message: 'Internal server error'
    });
  }
};

// Update project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('📝 Updating project:', id);

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    console.log('✅ Project updated:', project.name);

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });

  } catch (error) {
    console.error('❌ Update project error:', error);
    res.status(500).json({
      error: 'Failed to update project',
      message: 'Internal server error'
    });
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting project:', id);

    await prisma.project.delete({
      where: { id }
    });

    console.log('✅ Project deleted');

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete project error:', error);
    res.status(500).json({
      error: 'Failed to delete project',
      message: 'Internal server error'
    });
  }
};
