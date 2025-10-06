import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest, getTokenFromCookies } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function authenticateUser(request: NextRequest) {
  try {
    await connectDB();
    
    // Try to get token from Authorization header or cookies
    const token = getTokenFromRequest(request) || getTokenFromCookies(request);
    
    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    const user = await User.findById(payload.userId).select('-password');
    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export function withAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const user = await authenticateUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Add user to request object
    (request as any).user = user;
    return handler(request, ...args);
  };
}
