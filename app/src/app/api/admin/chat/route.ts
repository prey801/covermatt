import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { isAdminAuthenticated } from '@/lib/adminAuth';

// POST: Admin sends a reply
export async function POST(req: Request) {
    try {
        const authed = await isAdminAuthenticated();
        if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { conversationId, content } = await req.json();

        if (!conversationId || !content) {
            return NextResponse.json({ error: 'conversationId and content are required' }, { status: 400 });
        }

        await connectToDatabase();

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        conversation.lastMessageAt = new Date();
        // If it was closed, reopen it since admin is replying
        conversation.status = 'active';
        await conversation.save();

        const message = await Message.create({
            conversationId: conversation._id,
            sender: 'admin',
            content,
            read: false // customer hasn't read it yet
        });

        return NextResponse.json({ success: true, message });
    } catch (error: any) {
        console.error('Failed to send admin message:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// GET: Admin fetches conversations or messages for a specific conversation
export async function GET(req: Request) {
    try {
        const authed = await isAdminAuthenticated();
        if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get('conversationId');

        await connectToDatabase();

        // If a specific conversation is requested, fetch its messages
        if (conversationId) {
            const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
            
            // Mark customer messages as read since admin is viewing them
            await Message.updateMany(
                { conversationId, sender: 'customer', read: false },
                { $set: { read: true } }
            );

            return NextResponse.json({ messages });
        }

        // Otherwise, fetch all active conversations
        const conversations = await Conversation.find({ status: 'active' })
            .sort({ lastMessageAt: -1 })
            .lean() as any[];

        // For each conversation, we might want to get the unread count
        const enhancedConvos = await Promise.all(conversations.map(async (c) => {
            const unreadCount = await Message.countDocuments({ 
                conversationId: c._id, 
                sender: 'customer', 
                read: false 
            });
            
            // Get the last message preview
            const lastMsg = await Message.findOne({ conversationId: c._id }).sort({ createdAt: -1 });

            return {
                ...c,
                id: c._id.toString(),
                unreadCount,
                lastMessagePreview: lastMsg ? lastMsg.content : ''
            };
        }));

        return NextResponse.json({ conversations: enhancedConvos });
    } catch (error: any) {
        console.error('Failed to fetch admin chat data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
