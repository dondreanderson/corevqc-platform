<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backend NCR API Routes - CoreVQC</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50 font-sans">
    <div class="container mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="flex items-center mb-6">
                <i class="fas fa-server text-blue-600 text-2xl mr-3"></i>
                <h1 class="text-3xl font-bold text-gray-800">Backend NCR API Routes</h1>
            </div>
            <p class="text-gray-600 mb-6">Complete API endpoints for Non-Conformance Report (NCR) management in the CoreVQC platform. Add these routes to your <code class="bg-gray-100 px-2 py-1 rounded">backend/src/index.ts</code> file.</p>
        </div>

        <!-- API Endpoints Overview -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
                <i class="fas fa-list text-green-600 mr-2"></i>
                API Endpoints Overview
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="text-green-600 font-semibold">GET</div>
                    <div class="text-sm">/api/ncrs</div>
                    <div class="text-xs text-gray-600">List all NCRs</div>
                </div>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="text-blue-600 font-semibold">POST</div>
                    <div class="text-sm">/api/ncrs</div>
                    <div class="text-xs text-gray-600">Create new NCR</div>
                </div>
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div class="text-yellow-600 font-semibold">PUT</div>
                    <div class="text-sm">/api/ncrs/:id</div>
                    <div class="text-xs text-gray-600">Update NCR</div>
                </div>
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="text-red-600 font-semibold">DELETE</div>
                    <div class="text-sm">/api/ncrs/:id</div>
                    <div class="text-xs text-gray-600">Delete NCR</div>
                </div>
            </div>
        </div>

        <!-- Complete API Implementation -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
                <i class="fas fa-code text-purple-600 mr-2"></i>
                Complete API Implementation
            </h2>
            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre><code class="language-typescript">// Add these NCR API endpoints to your backend/src/index.ts file

// ==============================================
// NCR (Non-Conformance Report) API Endpoints
// ==============================================

// GET /api/ncrs - List all NCRs with filtering and search
app.get('/api/ncrs', async (req, res) => {
  try {
    console.log('🔍 GET NCRs endpoint called');
    const { 
      projectId, 
      status, 
      severity, 
      search, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter conditions
    const where: any = {};
    
    if (projectId) {
      where.projectId = projectId;
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (severity && severity !== 'all') {
      where.severity = severity;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { ncrNumber: { contains: search as string, mode: 'insensitive' } },
        { category: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build sort order
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    // Fetch NCRs with related data
    const [ncrs, totalCount] = await Promise.all([
      prisma.nCR.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true
            }
          },
          reportedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          photos: true
        },
        orderBy,
        skip,
        take
      }),
      prisma.nCR.count({ where })
    ]);

    console.log(`📊 Found ${ncrs.length} NCRs (${totalCount} total)`);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / take);
    const hasNextPage = Number(page) < totalPages;
    const hasPrevPage = Number(page) > 1;

    res.json({
      ncrs,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: take
      }
    });

  } catch (error) {
    console.error('❌ Error fetching NCRs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch NCRs',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/ncrs/:id - Get single NCR with full details
app.get('/api/ncrs/:id', async (req, res) => {
  try {
    console.log('🔍 GET Single NCR endpoint called with ID:', req.params.id);
    const { id } = req.params;

    const ncr = await prisma.nCR.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        reportedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        },
        photos: {
          select: {
            id: true,
            filename: true,
            originalName: true,
            url: true,
            caption: true,
            createdAt: true
          }
        }
      }
    });

    if (!ncr) {
      console.log('❌ NCR not found:', id);
      return res.status(404).json({ error: 'NCR not found' });
    }

    console.log('✅ NCR found:', ncr.ncrNumber);
    res.json(ncr);

  } catch (error) {
    console.error('❌ Error fetching NCR:', error);
    res.status(500).json({ 
      error: 'Failed to fetch NCR',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/ncrs - Create new NCR
app.post('/api/ncrs', async (req, res) => {
  try {
    console.log('🔍 Creating new NCR - received data:', req.body);
    
    const {
      title,
      description,
      severity,
      category,
      location,
      projectId,
      reportedById,
      correctiveAction,
      rootCause,
      dueDate
    } = req.body;

    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'NCR title is required' });
    }
    
    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'NCR description is required' });
    }
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    if (!reportedById) {
      return res.status(400).json({ error: 'Reporter ID is required' });
    }

    // Validate project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      return res.status(400).json({ error: 'Project not found' });
    }

    // Validate reporter exists
    const reporter = await prisma.user.findUnique({
      where: { id: reportedById }
    });
    
    if (!reporter) {
      return res.status(400).json({ error: 'Reporter not found' });
    }

    // Generate unique NCR number
    const ncrCount = await prisma.nCR.count({
      where: { projectId }
    });
    const ncrNumber = `NCR-${project.name.replace(/\s+/g, '').toUpperCase()}-${String(ncrCount + 1).padStart(3, '0')}`;

    // Validate severity
    const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const validatedSeverity = validSeverities.includes(severity) ? severity : 'MEDIUM';

    // Create NCR data
    const ncrData = {
      ncrNumber,
      title: title.trim(),
      description: description.trim(),
      severity: validatedSeverity,
      status: 'OPEN',
      category: category?.trim() || 'General',
      location: location?.trim() || null,
      correctiveAction: correctiveAction?.trim() || null,
      rootCause: rootCause?.trim() || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
      reportedById
    };

    console.log('📝 Prepared NCR data:', ncrData);

    // Create the NCR
    const newNCR = await prisma.nCR.create({
      data: ncrData,
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        reportedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    console.log('✅ NCR created successfully:', newNCR.ncrNumber);
    res.status(201).json(newNCR);

  } catch (error) {
    console.error('❌ Error creating NCR:', error);
    
    if (error instanceof Error) {
      res.status(500).json({ 
        error: 'Failed to create NCR',
        details: error.message,
        errorType: error.name
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to create NCR',
        details: 'Unknown error occurred'
      });
    }
  }
});

// PUT /api/ncrs/:id - Update existing NCR
app.put('/api/ncrs/:id', async (req, res) => {
  try {
    console.log('🔍 Updating NCR:', req.params.id, 'with data:', req.body);
    const { id } = req.params;
    
    const {
      title,
      description,
      severity,
      status,
      category,
      location,
      correctiveAction,
      rootCause,
      dueDate
    } = req.body;

    // Check if NCR exists
    const existingNCR = await prisma.nCR.findUnique({
      where: { id }
    });

    if (!existingNCR) {
      return res.status(404).json({ error: 'NCR not found' });
    }

    // Validate status if provided
    const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    // Build update data
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (severity !== undefined && validSeverities.includes(severity)) {
      updateData.severity = severity;
    }
    if (status !== undefined && validStatuses.includes(status)) {
      updateData.status = status;
      // Set closedAt if status is CLOSED
      if (status === 'CLOSED') {
        updateData.closedAt = new Date();
      } else if (existingNCR.status === 'CLOSED' && status !== 'CLOSED') {
        updateData.closedAt = null;
      }
    }
    if (category !== undefined) updateData.category = category.trim();
    if (location !== undefined) updateData.location = location?.trim() || null;
    if (correctiveAction !== undefined) updateData.correctiveAction = correctiveAction?.trim() || null;
    if (rootCause !== undefined) updateData.rootCause = rootCause?.trim() || null;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    console.log('📝 Update data prepared:', updateData);

    // Update the NCR
    const updatedNCR = await prisma.nCR.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        reportedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        photos: true
      }
    });

    console.log('✅ NCR updated successfully:', updatedNCR.ncrNumber);
    res.json(updatedNCR);

  } catch (error) {
    console.error('❌ Error updating NCR:', error);
    res.status(500).json({ 
      error: 'Failed to update NCR',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/ncrs/:id - Delete NCR
app.delete('/api/ncrs/:id', async (req, res) => {
  try {
    console.log('🔍 Deleting NCR:', req.params.id);
    const { id } = req.params;

    // Check if NCR exists
    const existingNCR = await prisma.nCR.findUnique({
      where: { id },
      include: {
        photos: true
      }
    });

    if (!existingNCR) {
      return res.status(404).json({ error: 'NCR not found' });
    }

    // Delete associated photos first (if any)
    if (existingNCR.photos.length > 0) {
      await prisma.photo.deleteMany({
        where: { ncrId: id }
      });
      console.log(`🗑️ Deleted ${existingNCR.photos.length} associated photos`);
    }

    // Delete the NCR
    await prisma.nCR.delete({
      where: { id }
    });

    console.log('✅ NCR deleted successfully:', existingNCR.ncrNumber);
    res.json({ 
      message: 'NCR deleted successfully',
      deletedNCR: {
        id: existingNCR.id,
        ncrNumber: existingNCR.ncrNumber,
        title: existingNCR.title
      }
    });

  } catch (error) {
    console.error('❌ Error deleting NCR:', error);
    res.status(500).json({ 
      error: 'Failed to delete NCR',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/ncrs/stats/:projectId - Get NCR statistics for a project
app.get('/api/ncrs/stats/:projectId', async (req, res) => {
  try {
    console.log('🔍 Getting NCR stats for project:', req.params.projectId);
    const { projectId } = req.params;

    // Get overall counts
    const [
      totalNCRs,
      openNCRs,
      inProgressNCRs,
      resolvedNCRs,
      closedNCRs,
      criticalNCRs,
      highNCRs,
      mediumNCRs,
      lowNCRs
    ] = await Promise.all([
      prisma.nCR.count({ where: { projectId } }),
      prisma.nCR.count({ where: { projectId, status: 'OPEN' } }),
      prisma.nCR.count({ where: { projectId, status: 'IN_PROGRESS' } }),
      prisma.nCR.count({ where: { projectId, status: 'RESOLVED' } }),
      prisma.nCR.count({ where: { projectId, status: 'CLOSED' } }),
      prisma.nCR.count({ where: { projectId, severity: 'CRITICAL' } }),
      prisma.nCR.count({ where: { projectId, severity: 'HIGH' } }),
      prisma.nCR.count({ where: { projectId, severity: 'MEDIUM' } }),
      prisma.nCR.count({ where: { projectId, severity: 'LOW' } })
    ]);

    // Get recent NCRs
    const recentNCRs = await prisma.nCR.findMany({
      where: { projectId },
      include: {
        reportedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Get category breakdown
    const categoryStats = await prisma.nCR.groupBy({
      by: ['category'],
      where: { projectId },
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    });

    const stats = {
      overview: {
        total: totalNCRs,
        open: openNCRs,
        inProgress: inProgressNCRs,
        resolved: resolvedNCRs,
        closed: closedNCRs
      },
      severity: {
        critical: criticalNCRs,
        high: highNCRs,
        medium: mediumNCRs,
        low: lowNCRs
      },
      categories: categoryStats.map(cat => ({
        name: cat.category,
        count: cat._count.category
      })),
      recent: recentNCRs.map(ncr => ({
        id: ncr.id,
        ncrNumber: ncr.ncrNumber,
        title: ncr.title,
        severity: ncr.severity,
        status: ncr.status,
        reportedBy: `${ncr.reportedBy.firstName} ${ncr.reportedBy.lastName}`,
        createdAt: ncr.createdAt
      }))
    };

    console.log('📊 NCR stats calculated:', stats.overview);
    res.json(stats);

  } catch (error) {
    console.error('❌ Error getting NCR stats:', error);
    res.status(500).json({ 
      error: 'Failed to get NCR statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/projects/:projectId/ncrs - Get NCRs for specific project (alternative endpoint)
app.get('/api/projects/:projectId/ncrs', async (req, res) => {
  try {
    console.log('🔍 Getting NCRs for project:', req.params.projectId);
    const { projectId } = req.params;
    const { status, severity, limit = 10 } = req.query;

    const where: any = { projectId };
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (severity && severity !== 'all') {
      where.severity = severity;
    }

    const ncrs = await prisma.nCR.findMany({
      where,
      include: {
        reportedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        photos: {
          select: {
            id: true,
            filename: true,
            url: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit)
    });

    console.log(`📊 Found ${ncrs.length} NCRs for project`);
    res.json(ncrs);

  } catch (error) {
    console.error('❌ Error fetching project NCRs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch project NCRs',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

console.log('✅ NCR API endpoints registered successfully');</code></pre>
            </div>
        </div>

        <!-- Installation Instructions -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
                <i class="fas fa-wrench text-orange-600 mr-2"></i>
                Installation Instructions
            </h2>
            <div class="space-y-4">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 class="font-semibold text-blue-800 mb-2">
                        <i class="fas fa-step-forward text-blue-600 mr-2"></i>
                        Step 1: Add API Routes
                    </h3>
                    <p class="text-blue-700">Copy the above code and add it to your <code class="bg-blue-100 px-2 py-1 rounded">backend/src/index.ts</code> file, before the server startup code.</p>
                </div>
                
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 class="font-semibold text-green-800 mb-2">
                        <i class="fas fa-database text-green-600 mr-2"></i>
                        Step 2: Verify Database Schema
                    </h3>
                    <p class="text-green-700">Ensure your Prisma schema includes the NCR model (it should already be there). Run <code class="bg-green-100 px-2 py-1 rounded">npx prisma generate</code> if needed.</p>
                </div>
                
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 class="font-semibold text-yellow-800 mb-2">
                        <i class="fas fa-rocket text-yellow-600 mr-2"></i>
                        Step 3: Test the APIs
                    </h3>
                    <p class="text-yellow-700">Restart your backend server and test the endpoints using the frontend components or a tool like Postman.</p>
                </div>
            </div>
        </div>

        <!-- API Testing Guide -->
        <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
                <i class="fas fa-vial text-purple-600 mr-2"></i>
                API Testing Examples
            </h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="font-semibold text-gray-800 mb-2">Create NCR</h3>
                    <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto"><code>POST /api/ncrs
{
  "title": "Concrete Quality Issue",
  "description": "Concrete mix does not meet specifications",
  "severity": "HIGH",
  "category": "Quality Control",
  "location": "Foundation Area A",
  "projectId": "your-project-id",
  "reportedById": "your-user-id"
}</code></pre>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="font-semibold text-gray-800 mb-2">Get NCRs with Filters</h3>
                    <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto"><code>GET /api/ncrs?projectId=xxx&status=OPEN&severity=HIGH&search=concrete&page=1&limit=10</code></pre>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    <script id="html_badge_script1">
        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDvxBIPkKZBkfarshPsCZGLUzAgcO0UvZ6nXQAgHW60DLGGL3lop0gSvpH5k4RLCfigdO%2Baq%2FsS3vpImjFgfj1QJtnnHNrsixDzI%2Br9lVhAWVn%2ByIlAJX0vxmUNiJ%2BoLOlGJTilLqXHxC%2BkDJd4zmGVzjEGVD1t2lIqmUvBPVCM3X%2FxOsLh%2FuNK7HGSM%2B0WlGv%2BbW4cSoHJBT%2F7GG%2FfHhVUyiZgDj8H7s5XmPawstBN680V6qKJgpeLmTMsQOKFJzPdGfHBdlwsv%2BUnN%2Btxwxuod5Un%2Fw9sMiXwejjmCc5okuHV57sd4WjQh0wlivBF87IatyK8BHT7txkivjUzlhdEajkxlaGPazz%2FV8Gq9q0c%2BP5TXyjDmqpR3LKesFfABoZtSA8Ll%2BCu%2FWDchHW1%2BciEDvwJvm71%2BZjUx%2F7iGyaDvO%2F%2B5k0uFengsfBJBp5gXERh4ikBwrkJ%2FE02vGJr2%2B1hRtyWTpi6KjYhXOuihUHKR0w4CeFZDmSxDOFLhk7x6hyEeEdqBkHN5h%2B4GMMvGE3IOwQ%2FVqGlrsOMvPiOW83%2ByY";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDvxBIPkKZBkfarshPsCZGLUzAgcO0UvZ6nXQAgHW60DLGGL3lop0gSvpH5k4RLCfigdO+aq/sS3vpImjFgfj1QJtnnHNrsixDzI+r9lVhAWVn+yIlAJX0vxmUNiJ+oLOlGJTilLqXHxC+kDJd4zmGVzjEGVD1t2lIqmUvBPVCM3X/xOsLh/uNK7HGSM+0WlGv+bW4cSoHJBT/7GG/fHhVUyiZgDj8H7s5XmPawstBN680V6qKJgpeLmTMsQOKFJzPdGfHBdlwsv+UnN+txwxuod5Un/w9sMiXwejjmCc5okuHV57sd4WjQh0wlivBF87IatyK8BHT7txkivjUzlhdEajkxlaGPazz/V8Gq9q0c+P5TXyjDmqpR3LKesFfABoZtSA8Ll+Cu/WDchHW1+ciEDvwJvm71+ZjUx/7iGyaDvO/+5k0uFengsfBJBp5gXERh4ikBwrkJ/E02vGJr2+1hRtyWTpi6KjYhXOuihUHKR0w4CeFZDmSxDOFLhk7x6hyEeEdqBkHN5h+4GMMvGE3IOwQ/VqGlrsOMvPiOW83+yY";
    </script>
    
    <script id="html_notice_dialog_script" src="https://www.genspark.ai/notice_dialog.js"></script>
    