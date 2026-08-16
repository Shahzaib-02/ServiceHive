











// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// /**
//  * Fetch live platform data from the backend.
//  * Returns a compact summary string to inject into the AI system prompt.
//  */
// async function fetchPlatformContext() {
//   try {
//     const res = await fetch(`${API_BASE_URL}/api/chat/context`)
//     if (!res.ok) return null
//     const data = await res.json()

//     // Build a readable summary for the AI
//     const categoryLines = Object.entries(data.servicesByCategory || {})
//       .map(([cat, services]) => {
//         const providerNames = [...new Set(services.map(s => s.provider))].slice(0, 5).join(', ')
//         const avgPrice = services.length
//           ? Math.round(services.reduce((sum, s) => sum + (s.price || 0), 0) / services.length)
//           : 0
//         return `  • ${cat}: ${services.length} listing(s), avg price PKR ${avgPrice}, providers: ${providerNames || 'N/A'}`
//       })
//       .join('\n')

//     const cityLines = (data.providersByCity || [])
//       .map(c => `  • ${c.city}: ${c.count} provider(s)`)
//       .join('\n')

//     const statusLines = Object.entries(data.bookingStatusBreakdown || {})
//       .map(([status, count]) => `  • ${status}: ${count}`)
//       .join('\n')

//     return `
// LIVE PLATFORM DATA (as of ${new Date(data.generatedAt).toLocaleString()}):

// Platform: ${data.platform}
// About: ${data.description}

// STATS:
//   • Total approved services: ${data.stats.totalApprovedServices}
//   • Total approved providers: ${data.stats.totalProviders}
//   • Total approved customers: ${data.stats.totalCustomers}
//   • Total bookings: ${data.stats.totalBookings}

// SERVICES BY CATEGORY:
// ${categoryLines || '  (none yet)'}

// PROVIDERS BY CITY:
// ${cityLines || '  (none yet)'}

// BOOKING STATUS BREAKDOWN:
// ${statusLines || '  (none yet)'}
// `.trim()
//   } catch {
//     return null
//   }
// }

// /**
//  * Send a user message to Claude with live ServiceHive context.
//  * Compatible with the existing ServiceHiveChatbot.jsx interface.
//  */
// export async function generateChatResponse(userMessage, conversationHistory = []) {
//   const platformContext = await fetchPlatformContext()

//   const systemPrompt = [
//     'You are ServiceHive Assistant, an AI chatbot embedded in the ServiceHive platform.',
//     'ServiceHive is a marketplace where customers book home, beauty, tech, and other local services from verified providers.',
//     '',
//     'Your job is to answer questions accurately using the live platform data provided below.',
//     'Be concise, helpful, and friendly. When quoting prices or counts, use the live data.',
//     'If asked about something not covered by the data, say you don\'t have that detail and suggest contacting support at support@servicehive.com.',
//     '',
//     platformContext
//       ? `--- LIVE PLATFORM DATA ---\n${platformContext}\n--- END OF LIVE DATA ---`
//       : 'Note: Live platform data is temporarily unavailable. Answer based on general ServiceHive knowledge.',
//   ].join('\n')

//   // Build messages array: include conversation history for context
//   const messages = [
//     ...conversationHistory
//       .filter(m => m.sender !== 'bot' || conversationHistory.indexOf(m) > 0) // skip initial greeting
//       .slice(-10) // last 10 messages max to keep context window small
//       .map(m => ({
//         role: m.sender === 'user' ? 'user' : 'assistant',
//         content: m.text,
//       })),
//     { role: 'user', content: userMessage },
//   ]

//   const response = await fetch(`${API_BASE_URL}/api/chat`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       system: systemPrompt,
//       messages,
//     }),
//   })

//   if (!response.ok) {
//     const err = await response.text()
//     throw new Error(`Backend API error: ${err}`)
//   }

//   const data = await response.json()

//   // Extract text from the content blocks
//   const text = (data.content || [])
//     .filter(block => block.type === 'text')
//     .map(block => block.text)
//     .join('\n')

//   return text || "I'm sorry, I couldn't generate a response. Please try again."
// }












const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Fetch live platform context from backend
 */
async function fetchPlatformContext() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chat/context`);
    if (!res.ok) {
      console.error('Failed to fetch context:', res.status);
      return null;
    }
    const data = await res.json();

    // Build readable summary for AI
    const categoryLines = Object.entries(data.servicesByCategory || {})
      .map(([cat, services]) => {
        const serviceList = services
          .map(s => `${s.title} (PKR ${s.price}, by ${s.provider})`)
          .join(', ');
        return `  [${cat}]: ${services.length} services — ${serviceList}`;
      })
      .join('\n');

    const cityLines = (data.providersByCity || [])
      .map(c => `  ${c.city}: ${c.count} provider(s)`)
      .join('\n');

    const statusLines = Object.entries(data.bookingStatusBreakdown || {})
      .map(([status, count]) => `  ${status}: ${count}`)
      .join('\n');

    return `
PLATFORM: ${data.platform}
ABOUT: ${data.description}
DATA UPDATED: ${new Date(data.generatedAt).toLocaleString()}

STATISTICS:
  Total approved services: ${data.stats.totalApprovedServices}
  Total approved providers: ${data.stats.totalProviders}
  Total approved customers: ${data.stats.totalCustomers}
  Total bookings: ${data.stats.totalBookings}

SERVICES BY CATEGORY:
${categoryLines || '  No services available'}

PROVIDERS BY CITY:
${cityLines || '  No providers available'}

BOOKING STATUS BREAKDOWN:
${statusLines || '  No bookings yet'}
`.trim();
  } catch (err) {
    console.error('Error fetching platform context:', err);
    return null;
  }
}

/**
 * Send message to chatbot with live platform data
 */
export async function generateChatResponse(userMessage, conversationHistory = []) {
  try {
    // Fetch live data first
    const platformContext = await fetchPlatformContext();
    
    if (!platformContext) {
      console.warn('Platform context unavailable, using fallback');
    }

    // Build strict system prompt that forces AI to use data
    const systemPrompt = [
      'You are ServiceHive Assistant. You answer questions using ONLY the LIVE PLATFORM DATA below.',
      '',
      'RULES:',
      '1. ALWAYS use specific numbers and names from the LIVE PLATFORM DATA.',
      '2. NEVER say "I do not have information" if the data is provided below.',
      '3. NEVER suggest contacting support for data that is already provided.',
      '4. If asked "how many services for home", count services in "home" category from the data.',
      '5. If asked "how many providers", give the exact number from Total approved providers.',
      '6. List specific service names and prices when asked about services.',
      '7. Mention provider cities when asked about locations.',
      '',
      'LIVE PLATFORM DATA:',
      platformContext || 'Data temporarily unavailable.',
      '',
      'ANSWER THE USER QUESTION NOW USING ONLY THE DATA ABOVE.'
    ].join('\n');

    // Build messages array
    const messages = [
      ...conversationHistory
        .filter(m => m.sender !== 'bot' || conversationHistory.indexOf(m) > 0)
        .slice(-10)
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      { role: 'user', content: userMessage },
    ];

    // Call backend
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system: systemPrompt,
        messages
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Chat API error: ${err}`);
    }

    const data = await response.json();

    const text = (data.content || [])
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    return text || "I'm sorry, I couldn't generate a response.";
    
  } catch (error) {
    console.error('Chat error:', error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
}