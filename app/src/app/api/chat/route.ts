import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';

// POST: Customer sends a message
export async function POST(req: Request) {
    try {
        const { sessionId, content, customerName, customerEmail } = await req.json();

        if (!sessionId || !content) {
            return NextResponse.json({ error: 'sessionId and content are required' }, { status: 400 });
        }

        await connectToDatabase();

        // Find or create conversation
        let conversation = await Conversation.findOne({ sessionId });
        
        if (!conversation) {
            conversation = await Conversation.create({
                sessionId,
                customerName: customerName || 'Guest',
                customerEmail: customerEmail || undefined,
                status: 'active'
            });
        } else {
            // Update lastMessageAt
            conversation.lastMessageAt = new Date();
            // Optional: update name/email if provided and it was missing before
            if (customerName && conversation.customerName === 'Guest') {
                conversation.customerName = customerName;
            }
            if (customerEmail && !conversation.customerEmail) {
                conversation.customerEmail = customerEmail;
            }
            await conversation.save();
        }

        // Create the message
        const message = await Message.create({
            conversationId: conversation._id,
            sender: 'customer',
            content
        });

        return NextResponse.json({ success: true, message });
    } catch (error: any) {
        console.error('Failed to send message:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// GET: Customer polls for messages in their session
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
        }

        await connectToDatabase();

        const conversation = await Conversation.findOne({ sessionId });
        if (!conversation) {
            return NextResponse.json({ messages: [] });
        }

        const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

        return NextResponse.json({ messages });
    } catch (error: any) {
        console.error('Failed to fetch messages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
