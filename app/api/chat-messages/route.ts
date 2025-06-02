import { NextRequest, NextResponse } from 'next/server';
import { dbRun, dbGet, dbAll, getPreparedStatements, dbUtils } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { projectId, messages, context } = await request.json();
    
    if (!projectId || !messages) {
      return NextResponse.json(
        { error: 'Project ID and messages are required' },
        { status: 400 }
      );
    }
    
    const stmt = getPreparedStatements();
    
    // Save each message to the database
    for (const message of messages) {
      if (!message.saved) {
        const messageId = dbUtils.generateId();
        stmt.createChatMessage.run(
          messageId,
          projectId,
          message.role,
          message.content,
          JSON.stringify({
            timestamp: message.timestamp,
            context: context
          })
        );
      }
    }
    
    // Update the quote with latest conversation summary and context
    const quote = dbGet("SELECT id, details FROM quotes WHERE project_id = ?", [projectId]) as any;
    if (quote) {
      const currentDetails = dbUtils.parseJson(quote.details) || {};
      dbRun(
        `UPDATE quotes 
         SET details = ? 
         WHERE id = ?`,
        [dbUtils.stringifyJson({ ...currentDetails, conversationContext: context }), quote.id]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Chat messages API error:', error);
    return NextResponse.json(
      { error: 'Failed to save chat messages' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    const stmt = getPreparedStatements();
    
    // Get all messages for this project
    const messages = stmt.getChatMessagesByProjectId.all(projectId) as any[];
    
    // Parse metadata for each message
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.created_at,
      metadata: dbUtils.parseJson(msg.metadata),
      saved: true
    }));
    
    // Get the latest context from quote details
    const quote = dbGet(
      `SELECT q.details 
       FROM quotes q 
       WHERE q.project_id = ? 
       ORDER BY q.created_at DESC 
       LIMIT 1`,
      [projectId]
    ) as any;
    
    const details = quote ? dbUtils.parseJson(quote.details) : {};
    const context = details?.conversationContext || {};
    
    return NextResponse.json({
      messages: formattedMessages,
      context
    });
  } catch (error) {
    console.error('Chat messages GET error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve chat messages' },
      { status: 500 }
    );
  }
}