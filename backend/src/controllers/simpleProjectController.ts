import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProjectController {
static async getProjects(req: any, res: Response) {
  try {
    const user = req.user;
    
    // For testing, use the first organization if no user
    let organizationId = user?.organizationId;
    
    if (!organizationId) {
      const firstOrg = await prisma.organization.findFirst();
      if (!firstOrg) {
        return res.status(404).json({ error: 'No organization found' });
      }
      organizationId = firstOrg.id;
    }
    
    const projects = await prisma.project.findMany({
      where: {
        organizationId: organizationId
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: {
            documents: true,
            inspections: true,
            ncrs: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    console.log(`📋 Found ${projects.length} projects`);

    res.json({
      success: true,
      projects
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      message: 'Internal server error'
    });
  }
}
 
  }

  // Create new project
  static async createProject(req: any, res: Response) {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const {
        name,
        description,
        clientName,
        clientContact,
        projectType,
        priority,
        budget,
        startDate,
        endDate,
        location
      } = req.body;

      // Validation
      if (!name) {
        return res.status(400).json({
          error: 'Project name is required'
        });
      }

      console.log('📝 Creating project:', name);

      const project = await prisma.project.create({
        data: {
          name,
          description,
          clientName,
          clientContact,
          projectType,
          priority: priority || 'MEDIUM',
          budget: budget ? parseFloat(budget) : null,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          location,
          organizationId: user.organizationId,
          ownerId: user.id
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

      console.log('✅ Project created successfully:', project.name);

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        project
      });

    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({
        error: 'Failed to create project',
        message: 'Internal server error'
      });
    }
  }

  // Get single project  
  static async getProject(req: any, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const project = await prisma.project.findFirst({
        where: {
          id,
          organizationId: user.organizationId
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

      if (!project) {
        return res.status(404).json({
          error: 'Project not found'
        });
      }

      res.json({
        success: true,
        project
      });

    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({
        error: 'Failed to fetch project',
        message: 'Internal server error'
      });
    }
  }

  // Update project
  static async updateProject(req: any, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;
      const updateData = req.body;

      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

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

      res.json({
        success: true,
        message: 'Project updated successfully',
        project
      });

    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({
        error: 'Failed to update project',
        message: 'Internal server error'
      });
    }
  }

  // Delete project
  static async deleteProject(req: any, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      await prisma.project.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });

    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({
        error: 'Failed to delete project',
        message: 'Internal server error'
      });
    }
  }
}
