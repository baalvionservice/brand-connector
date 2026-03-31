
import { NextResponse } from 'next/server';
import { campaigns } from '../campaigns/route';
import { messages } from '../messages/route';

const REPLY_TEMPLATES = [
  "Sounds interesting, let's talk.",
  "Send over a deck and pricing please.",
  "Not interested at the moment, thanks.",
  "How much do your top creators charge?",
  "Is this for India market specifically?"
];

export async function POST(request: Request) {
  const { campaignId } = await request.json();
  
  const campaign = campaigns.find(c => c.id === campaignId);
  const campaignMsgs = messages.filter(m => m.campaignId === campaignId && m.status === 'sent');

  // Randomly pick 20% to reply
  const count = Math.ceil(campaignMsgs.length * 0.2);
  let replyCount = 0;

  for (let i = 0; i < count; i++) {
    const msg = campaignMsgs[i];
    if (msg) {
      msg.status = 'replied';
      msg.replyText = REPLY_TEMPLATES[Math.floor(Math.random() * REPLY_TEMPLATES.length)];
      msg.isInterested = msg.replyText.includes('talk') || msg.replyText.includes('details');
      replyCount++;
    }
  }

  if (campaign) {
    campaign.replyCount += replyCount;
  }

  return NextResponse.json({
    success: true,
    data: { replies: replyCount }
  });
}
