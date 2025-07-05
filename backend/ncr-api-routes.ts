<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCR Backend API Routes - CoreVQC Platform</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        .code-block {
            background: #1e293b;
            color: #e2e8f0;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1rem 0;
            overflow-x: auto;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            line-height: 1.5;
        }
        .endpoint-method {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.875rem;
            margin-right: 0.5rem;
        }
        .method-get { background-color: #10b981; color: white; }
        .method-post { background-color: #3b82f6; color: white; }
        .method-put { background-color: #f59e0b; color: white; }
        .method-delete { background-color: #ef4444; color: white; }
        .keyword { color: #c792ea; }
        .string { color: #c3e88d; }
        .number { color: #f78c6c; }
        .comment { color: #546e7a; font-style: italic; }
        .function { color: #82aaff; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex items-center mb-4">
                <i class="fas fa-code text-3xl mr-4"></i>
                <div>
                    <h1 class="text-4xl font-bold">NCR Backend API Routes</h1>
                    <p class="text-lg opacity-90">Complete CRUD operations for Non-Conformance Reports</p>
                </div>
            </div>
            <div class="bg-white bg-opacity-10 rounded-lg p-4 mt-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div class="text-2xl font-bold">6</div>
                        <div class="text-sm">API Endpoints</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold">CRUD</div>
                        <div class="text-sm">Operations</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold">REST</div>
                        <div class="text-sm">Architecture</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold">TypeScript</div>
                        <div class="text-sm">Implementation</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- API Endpoints Overview -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <i class="fas fa-list mr-3 text-indigo-600"></i>
                API Endpoints Overview
            </h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="border rounded-lg p-4">
                    <div class="flex items-center mb-2">
                        <span class="endpoint-method method-get">GET</span>
                        <code class="text-sm">/api/ncrs</code>
                    </div>
                    <p class="text-gray-600 text-sm">Get all NCRs with filtering and pagination</p>
                </div>
                <div class="border rounded-lg p-4">
                    <div class="flex items-center mb-2">
                        <span class="endpoint-method method-post">POST</span>
                        <code class="text-sm">/api/ncrs</code>
                    </div>
                    <p class="text-gray-600 text-sm">Create a new NCR</p>
                </div>
                <div class="border rounded-lg p-4">
                    <div class="flex items-center mb-2">
                        <span class="endpoint-method method-get">GET</span>
                        <code class="text-sm">/api/ncrs/:id</code>
                    </div>
                    <p class="text-gray-600 text-sm">Get single NCR by ID</p>
                </div>
                <div class="border rounded-lg p-4">
                    <div class="flex items-center mb-2">
                        <span class="endpoint-method method-put">PUT</span>
                        <code class="text-sm">/api/ncrs/:id</code>
                    </div>
                    <p class="text-gray-600 text-sm">Update existing NCR</p>
                </div>
                <div class="border rounded-lg p-4">
                    <div class="flex items-center mb-2">
                        <span class="endpoint-method method-delete">DELETE</span>
                        <code class="text-sm">/api/ncrs/:id</code>
                    </div>
                    <p class="text-gray-600 text-sm">Delete NCR by ID</p>
                </div>
                <div class="border rounded-lg p-4">
                    <div class="flex items-center mb-2">
                        <span class="endpoint-method method-get">GET</span>
                        <code class="text-sm">/api/ncrs/metrics</code>
                    </div>
                    <p class="text-gray-600 text-sm">Get NCR dashboard metrics</p>
                </div>
            </div>
        </div>

        <!-- Installation Instructions -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <i class="fas fa-download mr-3 text-indigo-600"></i>
                Installation Instructions
            </h2>
            <div class="space-y-4">
                <div>
                    <h3 class="text-lg font-medium text-gray-800 mb-2">1. Create the NCR routes file</h3>
                    <p class="text-gray-600 mb-2">Create <code class="bg-gray-100 px-2 py-1 rounded">backend/src/routes/ncr-routes.ts</code></p>
                </div>
                <div>
                    <h3 class="text-lg font-medium text-gray-800 mb-2">2. Update main server file</h3>
                    <p class="text-gray-600 mb-2">Add NCR routes to your <code class="bg-gray-100 px-2 py-1 rounded">backend/src/index.ts</code></p>
                    <div class="code-block">
<span class="comment">// Add this import</span>
<span class="keyword">import</span> ncrRoutes <span class="keyword">from</span> <span class="string">'./routes/ncr-routes'</span>;

<span class="comment">// Add this route</span>
app.<span class="function">use</span>(<span class="string">'/api/ncrs'</span>, ncrRoutes);
                    </div>
                </div>
            </div>
        </div>

        <!-- Complete Backend Code -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <i class="fas fa-file-code mr-3 text-indigo-600"></i>
                Complete Backend Implementation
            </h2>
            
            <div class="mb-4">
                <h3 class="text-lg font-medium text-gray-800 mb-2">File: <code class="bg-gray-100 px-2 py-1 rounded">backend/src/routes/ncr-routes.ts</code></h3>
            </div>

            <div class="code-block">
<span class="keyword">import</span> { Router } <span class="keyword">from</span> <span class="string">'express'</span>;
<span class="keyword">import</span> { PrismaClient } <span class="keyword">from</span> <span class="string">'@prisma/client'</span>;
<span class="keyword">import</span> { body, validationResult } <span class="keyword">from</span> <span class="string">'express-validator'</span>;

<span class="keyword">const</span> router = <span class="function">Router</span>();
<span class="keyword">const</span> prisma = <span class="keyword">new</span> <span class="function">PrismaClient</span>();

<span class="comment">// GET /api/ncrs - Get all NCRs with filtering</span>
router.<span class="function">get</span>(<span class="string">'/'</span>, <span class="keyword">async</span> (req, res) => {
  <span class="keyword">try</span> {
    console.<span class="function">log</span>(<span class="string">'🔍 GET NCRs endpoint called'</span>);
    
    <span class="keyword">const</span> { 
      status, 
      severity, 
      category, 
      projectId, 
      page = <span class="number">1</span>, 
      limit = <span class="number">10</span>,
      search 
    } = req.query;

    <span class="comment">// Build filter conditions</span>
    <span class="keyword">const</span> where: <span class="keyword">any</span> = {};
    
    <span class="keyword">if</span> (status && status !== <span class="string">'all'</span>) {
      where.status = status;
    }
    
    <span class="keyword">if</span> (severity && severity !== <span class="string">'all'</span>) {
      where.severity = severity;
    }
    
    <span class="keyword">if</span> (category && category !== <span class="string">'all'</span>) {
      where.category = category;
    }
    
    <span class="keyword">if</span> (projectId) {
      where.projectId = projectId;
    }
    
    <span class="keyword">if</span> (search) {
      where.OR = [
        { title: { contains: search, mode: <span class="string">'insensitive'</span> } },
        { description: { contains: search, mode: <span class="string">'insensitive'</span> } },
        { ncrNumber: { contains: search, mode: <span class="string">'insensitive'</span> } },
        { location: { contains: search, mode: <span class="string">'insensitive'</span> } }
      ];
    }

    <span class="comment">// Calculate pagination</span>
    <span class="keyword">const</span> skip = (<span class="function">parseInt</span>(page <span class="keyword">as</span> <span class="keyword">string</span>) - <span class="number">1</span>) * <span class="function">parseInt</span>(limit <span class="keyword">as</span> <span class="keyword">string</span>);
    <span class="keyword">const</span> take = <span class="function">parseInt</span>(limit <span class="keyword">as</span> <span class="keyword">string</span>);

    <span class="comment">// Get NCRs with related data</span>
    <span class="keyword">const</span> ncrs = <span class="keyword">await</span> prisma.nCR.<span class="function">findMany</span>({
      where,
      include: {
        project: {
          select: { id: <span class="keyword">true</span>, name: <span class="keyword">true</span> }
        },
        reportedBy: {
          select: { id: <span class="keyword">true</span>, firstName: <span class="keyword">true</span>, lastName: <span class="keyword">true</span> }
        },
        photos: <span class="keyword">true</span>
      },
      orderBy: { createdAt: <span class="string">'desc'</span> },
      skip,
      take
    });

    <span class="comment">// Get total count for pagination</span>
    <span class="keyword">const</span> totalCount = <span class="keyword">await</span> prisma.nCR.<span class="function">count</span>({ where });
    <span class="keyword">const</span> totalPages = Math.<span class="function">ceil</span>(totalCount / take);

    console.<span class="function">log</span>(<span class="string">`📊 Found ${ncrs.length} NCRs (${totalCount} total)`</span>);

    res.<span class="function">json</span>({
      ncrs,
      pagination: {
        currentPage: <span class="function">parseInt</span>(page <span class="keyword">as</span> <span class="keyword">string</span>),
        totalPages,
        totalCount,
        hasNextPage: <span class="function">parseInt</span>(page <span class="keyword">as</span> <span class="keyword">string</span>) < totalPages,
        hasPrevPage: <span class="function">parseInt</span>(page <span class="keyword">as</span> <span class="keyword">string</span>) > <span class="number">1</span>
      }
    });

  } <span class="keyword">catch</span> (error) {
    console.<span class="function">error</span>(<span class="string">'❌ Error fetching NCRs:'</span>, error);
    res.<span class="function">status</span>(<span class="number">500</span>).<span class="function">json</span>({ 
      error: <span class="string">'Failed to fetch NCRs'</span>, 
      details: error <span class="keyword">instanceof</span> Error ? error.message : <span class="string">'Unknown error'</span>
    });
  }
});

<span class="comment">// POST /api/ncrs - Create new NCR</span>
router.<span class="function">post</span>(<span class="string">'/'</span>, [
  <span class="function">body</span>(<span class="string">'title'</span>).<span class="function">notEmpty</span>().<span class="function">withMessage</span>(<span class="string">'Title is required'</span>),
  <span class="function">body</span>(<span class="string">'description'</span>).<span class="function">notEmpty</span>().<span class="function">withMessage</span>(<span class="string">'Description is required'</span>),
  <span class="function">body</span>(<span class="string">'severity'</span>).<span class="function">isIn</span>([<span class="string">'LOW'</span>, <span class="string">'MEDIUM'</span>, <span class="string">'HIGH'</span>, <span class="string">'CRITICAL'</span>]).<span class="function">withMessage</span>(<span class="string">'Invalid severity'</span>),
  <span class="function">body</span>(<span class="string">'category'</span>).<span class="function">notEmpty</span>().<span class="function">withMessage</span>(<span class="string">'Category is required'</span>),
  <span class="function">body</span>(<span class="string">'projectId'</span>).<span class="function">notEmpty</span>().<span class="function">withMessage</span>(<span class="string">'Project ID is required'</span>),
  <span class="function">body</span>(<span class="string">'reportedById'</span>).<span class="function">notEmpty</span>().<span class="function">withMessage</span>(<span class="string">'Reporter ID is required'</span>)
], <span class="keyword">async</span> (req, res) => {
  <span class="keyword">try</span> {
    <span class="comment">// Check validation errors</span>
    <span class="keyword">const</span> errors = <span class="function">validationResult</span>(req);
    <span class="keyword">if</span> (!errors.<span class="function">isEmpty</span>()) {
      <span class="keyword">return</span> res.<span class="function">status</span>(<span class="number">400</span>).<span class="function">json</span>({ 
        error: <span class="string">'Validation failed'</span>, 
        details: errors.<span class="function">array</span>() 
      });
    }

    console.<span class="function">log</span>(<span class="string">'🔍 Creating new NCR - received data:'</span>, req.body);

    <span class="keyword">const</span> {
      title,
      description,
      severity,
      category,
      location,
      projectId,
      reportedById,
      dueDate
    } = req.body;

    <span class="comment">// Generate NCR number</span>
    <span class="keyword">const</span> ncrCount = <span class="keyword">await</span> prisma.nCR.<span class="function">count</span>();
    <span class="keyword">const</span> ncrNumber = <span class="string">`NCR-${String(ncrCount + 1).padStart(3, '0')}`</span>;

    <span class="comment">// Verify project exists</span>
    <span class="keyword">const</span> project = <span class="keyword">await</span> prisma.project.<span class="function">findUnique</span>({
      where: { id: projectId }
    });

    <span class="keyword">if</span> (!project) {
      <span class="keyword">return</span> res.<span class="function">status</span>(<span class="number">404</span>).<span class="function">json</span>({ error: <span class="string">'Project not found'</span> });
    }

    <span class="comment">// Verify user exists</span>
    <span class="keyword">const</span> user = <span class="keyword">await</span> prisma.user.<span class="function">findUnique</span>({
      where: { id: reportedById }
    });

    <span class="keyword">if</span> (!user) {
      <span class="keyword">return</span> res.<span class="function">status</span>(<span class="number">404</span>).<span class="function">json</span>({ error: <span class="string">'User not found'</span> });
    }

    <span class="comment">// Create NCR</span>
    <span class="keyword">const</span> newNCR = <span class="keyword">await</span> prisma.nCR.<span class="function">create</span>({
      data: {
        ncrNumber,
        title: title.<span class="function">trim</span>(),
        description: description.<span class="function">trim</span>(),
        severity,
        status: <span class="string">'OPEN'</span>,
        category: category.<span class="function">trim</span>(),
        location: location?.<span class="function">trim</span>() || <span class="keyword">null</span>,
        dueDate: dueDate ? <span class="keyword">new</span> <span class="function">Date</span>(dueDate) : <span class="keyword">null</span>,
        projectId,
        reportedById
      },
      include: {
        project: {
          select: { id: <span class="keyword">true</span>, name: <span class="keyword">true</span> }
        },
        reportedBy: {
          select: { id: <span class="keyword">true</span>, firstName: <span class="keyword">true</span>, lastName: <span class="keyword">true</span> }
        }
      }
    });

    console.<span class="function">log</span>(<span class="string">'✅ NCR created successfully:'</span>, newNCR.ncrNumber);
    res.<span class="function">status</span>(<span class="number">201</span>).<span class="function">json</span>(newNCR);

  } <span class="keyword">catch</span> (error) {
    console.<span class="function">error</span>(<span class="string">'❌ Error creating NCR:'</span>, error);
    res.<span class="function">status</span>(<span class="number">500</span>).<span class="function">json</span>({ 
      error: <span class="string">'Failed to create NCR'</span>, 
      details: error <span class="keyword">instanceof</span> Error ? error.message : <span class="string">'Unknown error'</span>
    });
  }
});

<span class="comment">// GET /api/ncrs/:id - Get single NCR</span>
router.<span class="function">get</span>(<span class="string">'/:id'</span>, <span class="keyword">async</span> (req, res) => {
  <span class="keyword">try</span> {
    <span class="keyword">const</span> { id } = req.params;
    console.<span class="function">log</span>(<span class="string">'🔍 GET Single NCR endpoint called with ID:'</span>, id);

    <span class="keyword">const</span> ncr = <span class="keyword">await</span> prisma.nCR.<span class="function">findUnique</span>({
      where: { id },
      include: {
        project: {
          select: { id: <span class="keyword">true</span>, name: <span class="keyword">true</span> }
        },
        reportedBy: {
          select: { id: <span class="keyword">true</span>, firstName: <span class="keyword">true</span>, lastName: <span class="keyword">true</span> }
        },
        photos: <span class="keyword">true</span>
      }
    });

    <span class="keyword">if</span> (!ncr) {
      console.<span class="function">log</span>(<span class="string">'❌ NCR not found:'</span>, id);
      <span class="keyword">return</span> res.<span class="function">status</span>(<span class="number">404</span>).<span class="function">json</span>({ error: <span class="string">'NCR not found'</span> });
    }

    console.<span class="function">log</span>(<span class="string">'✅ NCR found:'</span>, ncr.ncrNumber);
    res.<span class="function">json</span>(ncr);

  } <span class="keyword">catch</span> (error) {
    console.<span class="function">error</span>(<span class="string">'❌ Error fetching NCR:'</span>, error);
    res.<span class="function">status</span>(<span class="number">500</span>).<span class="function">json</span>({ 
      error: <span class="string">'Failed to fetch NCR'</span>, 
      details: error <span class="keyword">instanceof</span> Error ? error.message : <span class="string">'Unknown error'</span>
    });
  }
});

<span class="comment">// PUT /api/ncrs/:id - Update NCR</span>
router.<span class="function">put</span>(<span class="string">'/:id'</span>, [
  <span class="function">body</span>(<span class="string">'title'</span>).<span class="function">optional</span>().<span class="function">notEmpty</span>().<span class="function">withMessage</span>(<span class="string">'Title cannot be empty'</span>),
  <span class="function">body</span>(<span class="string">'description'</span>).<span class="function">optional</span>().<span class="function">notEmpty</span>().<span class="function">withMessage</span>(<span class="string">'Description cannot be empty'</span>),
  <span class="function">body</span>(<span class="string">'severity'</span>).<span class="function">optional</span>().<span class="function">isIn</span>([<span class="string">'LOW'</span>, <span class="string">'MEDIUM'</span>, <span class="string">'HIGH'</span>, <span class="string">'CRITICAL'</span>]),
  <span class="function">body</span>(<span class="string">'status'</span>).<span class="function">optional</span>().<span class="function">isIn</span>([<span class="string">'OPEN'</span>, <span class="string">'IN_PROGRESS'</span>, <span class="string">'RESOLVED'</span>, <span class="string">'CLOSED'</span>])
], <span class="keyword">async</span> (req, res) => {
  <span class="keyword">try</span> {
    <span class="keyword">const</span> errors = <span class="function">validationResult</span>(req);
    <span class="keyword">if</span> (!errors.<span class="function">isEmpty</span>()) {
      <span class="keyword">return</span> res.<span class="function">status</span>(<span class="number">400</span>).<span class="function">json</span>({ 
        error: <span class="string">'Validation failed'</span>, 
        details: errors.<span class="function">array</span>() 
      });
    }

    <span class="keyword">const</span> { id } = req.params;
    console.<span class="function">log</span>(<span class="string">'🔍 Updating NCR with ID:'</span>, id, <span class="string">'Data:'</span>, req.body);

    <span class="comment">// Check if NCR exists</span>
    <span class="keyword">const</span> existingNCR = <span class="keyword">await</span> prisma.nCR.<span class="function">findUnique</span>({
      where: { id }
    });

    <span class="keyword">if</span> (!existingNCR) {
      <span class="keyword">return</span> res.<span class="function">status</span>(<span class="number">404</span>).<span class="function">json</span>({ error: <span class="string">'NCR not found'</span> });
    }

    <span class="comment">// Prepare update data</span>
    <span class="keyword">const</span> updateData: <span class="keyword">any</span> = {};
    <span class="keyword">const</span> allowedFields = [
      <span class="string">'title'</span>, <span class="string">'description'</span>, <span class="string">'severity'</span>, <span class="string">'status'</span>, 
      <span class="string">'category'</span>, <span class="string">'location'</span>, <span class="string">'correctiveAction'</span>, 
      <span class="string">'rootCause'</span>, <span class="string">'dueDate'</span>
    ];

    allowedFields.<span class="function">forEach</span>(field => {
      <span class="keyword">if</span> (req.body[field] !== <span class="keyword">undefined</span>) {
        <span class="keyword">if</span> (field === <span class="string">'dueDate'</span> && req.body[field]) {
          updateData[field] = <span class="keyword">new</span> <span class="function">Date</span>(req.body[field]);
        } <span class="keyword">else</span> <span class="keyword">if</span> (<span class="keyword">typeof</span> req.body[field] === <span class="string">'string'</span>) {
          updateData[field] = req.body[field].<span class="function">trim</span>();
        } <span class="keyword">else</span> {
          updateData[field] = req.body[field];
        }
      }
    });

    <span class="comment">// If status is being changed to CLOSED, set closedAt</span>
    <span class="keyword">if</span> (updateData.status === <span class="string">'CLOSED'</span> && existingNCR.status !== <span class="string">'CLOSED'</span>) {
      updateData.closedAt = <span class="keyword">new</span> <span class="function">Date</span>();
    } <span class="keyword">else</span> <span class="keyword">if</span> (updateData.status && updateData.status !== <span class="string">'CLOSED'</span>) {
      updateData.closedAt = <span class="keyword">null</span>;
    }

    <span class="keyword">const</span> updatedNCR = <span class="keyword">await</span> prisma.nCR.<span class="function">update</span>({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: { id: <span class="keyword">true</span>, name: <span class="keyword">true</span> }
        },
        reportedBy: {
          select: { id: <span class="keyword">true</span>, firstName: <span class="keyword">true</span>, lastName: <span class="keyword">true</span> }
        },
        photos: <span class="keyword">true</span>
      }
    });

    console.<span class="function">log</span>(<span class="string">'✅ NCR updated successfully:'</span>, updatedNCR.ncrNumber);
    res.<span class="function">json</span>(updatedNCR);

  } <span class="keyword">catch</span> (error) {
    console.<span class="function">error</span>(<span class="string">'❌ Error updating NCR:'</span>, error);
    res.<span class="function">status</span>(<span class="number">500</span>).<span class="function">json</span>({ 
      error: <span class="string">'Failed to update NCR'</span>, 
      details: error <span class="keyword">instanceof</span> Error ? error.message : <span class="string">'Unknown error'</span>
    });
  }
});

<span class="comment">// DELETE /api/ncrs/:id - Delete NCR</span>
router.<span class="function">delete</span>(<span class="string">'/:id'</span>, <span class="keyword">async</span> (req, res) => {
  <span class="keyword">try</span> {
    <span class="keyword">const</span> { id } = req.params;
    console.<span class="function">log</span>(<span class="string">'🔍 Deleting NCR with ID:'</span>, id);

    <span class="comment">// Check if NCR exists</span>
    <span class="keyword">const</span> existingNCR = <span class="keyword">await</span> prisma.nCR.<span class="function">findUnique</span>({
      where: { id }
    });

    <span class="keyword">if</span> (!existingNCR) {
      <span class="keyword">return</span> res.<span class="function">status</span>(<span class="number">404</span>).<span class="function">json</span>({ error: <span class="string">'NCR not found'</span> });
    }

    <span class="comment">// Delete related photos first (if any)</span>
    <span class="keyword">await</span> prisma.photo.<span class="function">deleteMany</span>({
      where: { ncrId: id }
    });

    <span class="comment">// Delete the NCR</span>
    <span class="keyword">await</span> prisma.nCR.<span class="function">delete</span>({
      where: { id }
    });

    console.<span class="function">log</span>(<span class="string">'✅ NCR deleted successfully:'</span>, existingNCR.ncrNumber);
    res.<span class="function">json</span>({ 
      message: <span class="string">'NCR deleted successfully'</span>, 
      ncrNumber: existingNCR.ncrNumber 
    });

  } <span class="keyword">catch</span> (error) {
    console.<span class="function">error</span>(<span class="string">'❌ Error deleting NCR:'</span>, error);
    res.<span class="function">status</span>(<span class="number">500</span>).<span class="function">json</span>({ 
      error: <span class="string">'Failed to delete NCR'</span>, 
      details: error <span class="keyword">instanceof</span> Error ? error.message : <span class="string">'Unknown error'</span>
    });
  }
});

<span class="comment">// GET /api/ncrs/metrics - Get NCR dashboard metrics</span>
router.<span class="function">get</span>(<span class="string">'/metrics'</span>, <span class="keyword">async</span> (req, res) => {
  <span class="keyword">try</span> {
    console.<span class="function">log</span>(<span class="string">'🔍 GET NCR metrics endpoint called'</span>);

    <span class="keyword">const</span> { projectId } = req.query;
    <span class="keyword">const</span> whereClause = projectId ? { projectId: projectId <span class="keyword">as</span> <span class="keyword">string</span> } : {};

    <span class="comment">// Get total counts</span>
    <span class="keyword">const</span> [
      totalNCRs,
      openNCRs,
      inProgressNCRs,
      resolvedNCRs,
      closedNCRs,
      criticalNCRs,
      highNCRs,
      overdueNCRs
    ] = <span class="keyword">await</span> Promise.<span class="function">all</span>([
      prisma.nCR.<span class="function">count</span>({ where: whereClause }),
      prisma.nCR.<span class="function">count</span>({ where: { ...whereClause, status: <span class="string">'OPEN'</span> } }),
      prisma.nCR.<span class="function">count</span>({ where: { ...whereClause, status: <span class="string">'IN_PROGRESS'</span> } }),
      prisma.nCR.<span class="function">count</span>({ where: { ...whereClause, status: <span class="string">'RESOLVED'</span> } }),
      prisma.nCR.<span class="function">count</span>({ where: { ...whereClause, status: <span class="string">'CLOSED'</span> } }),
      prisma.nCR.<span class="function">count</span>({ where: { ...whereClause, severity: <span class="string">'CRITICAL'</span> } }),
      prisma.nCR.<span class="function">count</span>({ where: { ...whereClause, severity: <span class="string">'HIGH'</span> } }),
      prisma.nCR.<span class="function">count</span>({ 
        where: { 
          ...whereClause, 
          dueDate: { lt: <span class="keyword">new</span> <span class="function">Date</span>() },
          status: { notIn: [<span class="string">'CLOSED'</span>, <span class="string">'RESOLVED'</span>] }
        } 
      })
    ]);

    <span class="comment">// Calculate quality score (percentage of resolved/closed NCRs)</span>
    <span class="keyword">const</span> resolvedCount = resolvedNCRs + closedNCRs;
    <span class="keyword">const</span> qualityScore = totalNCRs > <span class="number">0</span> ? Math.<span class="function">round</span>((resolvedCount / totalNCRs) * <span class="number">100</span>) : <span class="number">100</span>;

    <span class="comment">// Get status distribution</span>
    <span class="keyword">const</span> statusDistribution = {
      OPEN: openNCRs,
      IN_PROGRESS: inProgressNCRs,
      RESOLVED: resolvedNCRs,
      CLOSED: closedNCRs
    };

    <span class="comment">// Get severity distribution</span>
    <span class="keyword">const</span> [lowNCRs, mediumNCRs] = <span class="keyword">await</span> Promise.<span class="function">all</span>([
      prisma.nCR.<span class="function">count</span>({ where: { ...whereClause, severity: <span class="string">'LOW'</span> } }),
      prisma.nCR.<span class="function">count</span>({ where: { ...whereClause, severity: <span class="string">'MEDIUM'</span> } })
    ]);

    <span class="keyword">const</span> severityDistribution = {
      CRITICAL: criticalNCRs,
      HIGH: highNCRs,
      MEDIUM: mediumNCRs,
      LOW: lowNCRs
    };

    <span class="keyword">const</span> metrics = {
      totalNCRs,
      openNCRs: openNCRs + inProgressNCRs,
      criticalNCRs,
      overdueNCRs,
      qualityScore,
      statusDistribution,
      severityDistribution,
      resolvedPercentage: totalNCRs > <span class="number">0</span> ? Math.<span class="function">round</span>((resolvedCount / totalNCRs) * <span class="number">100</span>) : <span class="number">0</span>
    };

    console.<span class="function">log</span>(<span class="string">'📊 NCR metrics calculated:'</span>, metrics);
    res.<span class="function">json</span>(metrics);

  } <span class="keyword">catch</span> (error) {
    console.<span class="function">error</span>(<span class="string">'❌ Error fetching NCR metrics:'</span>, error);
    res.<span class="function">status</span>(<span class="number">500</span>).<span class="function">json</span>({ 
      error: <span class="string">'Failed to fetch NCR metrics'</span>, 
      details: error <span class="keyword">instanceof</span> Error ? error.message : <span class="string">'Unknown error'</span>
    });
  }
});

<span class="keyword">export</span> <span class="keyword">default</span> router;
            </div>
        </div>

        <!-- Response Examples -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <i class="fas fa-exchange-alt mr-3 text-indigo-600"></i>
                Response Examples
            </h2>
            
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-medium text-gray-800 mb-3">GET /api/ncrs - Success Response</h3>
                    <div class="code-block">
{
  <span class="string">"ncrs"</span>: [
    {
      <span class="string">"id"</span>: <span class="string">"clq123..."</span>,
      <span class="string">"ncrNumber"</span>: <span class="string">"NCR-001"</span>,
      <span class="string">"title"</span>: <span class="string">"Concrete Quality Issue"</span>,
      <span class="string">"description"</span>: <span class="string">"Concrete strength below specification"</span>,
      <span class="string">"severity"</span>: <span class="string">"HIGH"</span>,
      <span class="string">"status"</span>: <span class="string">"OPEN"</span>,
      <span class="string">"category"</span>: <span class="string">"Quality"</span>,
      <span class="string">"location"</span>: <span class="string">"Foundation Block A"</span>,
      <span class="string">"createdAt"</span>: <span class="string">"2025-01-05T10:30:00Z"</span>,
      <span class="string">"project"</span>: {
        <span class="string">"id"</span>: <span class="string">"proj123"</span>,
        <span class="string">"name"</span>: <span class="string">"Downtown Office Complex"</span>
      },
      <span class="string">"reportedBy"</span>: {
        <span class="string">"id"</span>: <span class="string">"user123"</span>,
        <span class="string">"firstName"</span>: <span class="string">"John"</span>,
        <span class="string">"lastName"</span>: <span class="string">"Smith"</span>
      }
    }
  ],
  <span class="string">"pagination"</span>: {
    <span class="string">"currentPage"</span>: <span class="number">1</span>,
    <span class="string">"totalPages"</span>: <span class="number">3</span>,
    <span class="string">"totalCount"</span>: <span class="number">24</span>,
    <span class="string">"hasNextPage"</span>: <span class="keyword">true</span>,
    <span class="string">"hasPrevPage"</span>: <span class="keyword">false</span>
  }
}
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-medium text-gray-800 mb-3">GET /api/ncrs/metrics - Success Response</h3>
                    <div class="code-block">
{
  <span class="string">"totalNCRs"</span>: <span class="number">24</span>,
  <span class="string">"openNCRs"</span>: <span class="number">8</span>,
  <span class="string">"criticalNCRs"</span>: <span class="number">3</span>,
  <span class="string">"overdueNCRs"</span>: <span class="number">2</span>,
  <span class="string">"qualityScore"</span>: <span class="number">87</span>,
  <span class="string">"statusDistribution"</span>: {
    <span class="string">"OPEN"</span>: <span class="number">5</span>,
    <span class="string">"IN_PROGRESS"</span>: <span class="number">3</span>,
    <span class="string">"RESOLVED"</span>: <span class="number">8</span>,
    <span class="string">"CLOSED"</span>: <span class="number">8</span>
  },
  <span class="string">"severityDistribution"</span>: {
    <span class="string">"CRITICAL"</span>: <span class="number">3</span>,
    <span class="string">"HIGH"</span>: <span class="number">6</span>,
    <span class="string">"MEDIUM"</span>: <span class="number">10</span>,
    <span class="string">"LOW"</span>: <span class="number">5</span>
  },
  <span class="string">"resolvedPercentage"</span>: <span class="number">67</span>
}
                    </div>
                </div>
            </div>
        </div>

        <!-- Testing Instructions -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 class="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <i class="fas fa-flask mr-2"></i>
                Testing the API
            </h3>
            <div class="space-y-3 text-blue-800">
                <p><strong>1. Start your backend server:</strong> <code class="bg-blue-100 px-2 py-1 rounded">npm run dev</code></p>
                <p><strong>2. Test with curl or Postman:</strong></p>
                <div class="bg-blue-100 rounded p-3 mt-2">
                    <code>curl -X GET "http://localhost:8000/api/ncrs" -H "Content-Type: application/json"</code>
                </div>
                <p><strong>3. Check the console logs</strong> for detailed debugging information</p>
                <p><strong>4. Verify database connections</strong> are working properly</p>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="bg-gray-800 text-white py-8 mt-12">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <h3 class="text-xl font-semibold mb-2">CoreVQC Platform</h3>
            <p class="text-gray-400">Complete NCR Backend API Implementation</p>
            <p class="text-sm text-gray-500 mt-4">Ready for integration with your frontend components</p>
        </div>
    </div>
</body>
</html>
    <script id="html_badge_script1">
        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDtFrrvLF08orYqcKP79qEuap3kAZsbBNMeQrstaPQjQW1MJhUy14JAKyNchv%2Bq%2F2LYCLJjJQJ0hFrzA7K2P%2FMOos5MuMXNLhuyw%2FQGA%2F7buOL3J4G84zopeSoH0fhTIZUAEUFCrTzHm9FHaflDFdcLDjzH64Ahzrmx%2Fv1flc3PGv%2FqXJwUnDQTAnsAhd1%2FGOqhDFj0%2BCrYE5%2F0w6dfBd%2Fn%2FNhYKo%2F3DjQvT1wwNoX78xKWC5JehekkHcdkiLWkzM08L%2BHLJMDMKCwWqMg7nrbZEK6BPcfRGYIa0Bog2HX6alLZSFjtLi1n2maIMsczK6pNpyUpg7HGTNeKGBMQ6zfQDf3c7iQYnG0pE1yeA5R4ur5hhbbxLTRabAy%2FrYYliUiDIGIfxRCphHsyZq%2FoHXIPUTpWOubrYN0glorPeWhU5anM8y5NsrbsHIYDWDWjDtHVvLrXwvZDxj32TdtyDZamviswXEfqWePyDB9rkxiNnA6nuqhVOCwBZg%2FiI%2FVOo77byn0F9wBo2b0GZSmqmRx08U0ZH9lCzpp2mIPhtbH%2FgE";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDtFrrvLF08orYqcKP79qEuap3kAZsbBNMeQrstaPQjQW1MJhUy14JAKyNchv+q/2LYCLJjJQJ0hFrzA7K2P/MOos5MuMXNLhuyw/QGA/7buOL3J4G84zopeSoH0fhTIZUAEUFCrTzHm9FHaflDFdcLDjzH64Ahzrmx/v1flc3PGv/qXJwUnDQTAnsAhd1/GOqhDFj0+CrYE5/0w6dfBd/n/NhYKo/3DjQvT1wwNoX78xKWC5JehekkHcdkiLWkzM08L+HLJMDMKCwWqMg7nrbZEK6BPcfRGYIa0Bog2HX6alLZSFjtLi1n2maIMsczK6pNpyUpg7HGTNeKGBMQ6zfQDf3c7iQYnG0pE1yeA5R4ur5hhbbxLTRabAy/rYYliUiDIGIfxRCphHsyZq/oHXIPUTpWOubrYN0glorPeWhU5anM8y5NsrbsHIYDWDWjDtHVvLrXwvZDxj32TdtyDZamviswXEfqWePyDB9rkxiNnA6nuqhVOCwBZg/iI/VOo77byn0F9wBo2b0GZSmqmRx08U0ZH9lCzpp2mIPhtbH/gE";
    </script>
    
    <script id="html_notice_dialog_script" src="https://www.genspark.ai/notice_dialog.js"></script>
    