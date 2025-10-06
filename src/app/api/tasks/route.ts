import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import Project from '@/models/Project';
import { authenticateUser } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query: { userId: string; projectId?: string; status?: string } = { userId: user._id };
    
    if (projectId) {
      query.projectId = projectId;
    }
    
    if (status) {
      query.status = status;
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(query)
      .populate('projectId', 'title')
      .sort(sort);

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { title, description, status, dueDate, projectId } = await request.json();

    if (!title || !description || !dueDate || !projectId) {
      return NextResponse.json(
        { error: 'Title, description, due date, and project ID are required' },
        { status: 400 }
      );
    }

    // Verify project belongs to user
    const project = await Project.findOne({
      _id: projectId,
      userId: user._id,
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      dueDate: new Date(dueDate),
      projectId,
      userId: user._id,
    });

    const populatedTask = await Task.findById(task._id).populate('projectId', 'title');

    return NextResponse.json(
      { 
        message: 'Task created successfully',
        task: populatedTask 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
