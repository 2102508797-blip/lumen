import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Use Node.js runtime for better compatibility
export const runtime = 'nodejs'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.EMERGENT_LLM_KEY || '',
  baseURL: 'https://api.emergent.ai/v1',
  dangerouslyAllowBrowser: false,
  timeout: 30000, // 30 second timeout
  maxRetries: 2,
})

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json()
    const { messages, model = 'gpt-4o-mini' } = body

    console.log('Chat API called with:', { 
      messageCount: messages?.length, 
      model,
      hasKey: !!process.env.EMERGENT_LLM_KEY 
    })

    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages:', messages)
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Check API key
    if (!process.env.EMERGENT_LLM_KEY) {
      console.error('EMERGENT_LLM_KEY not found in environment')
      return NextResponse.json(
        { error: 'API key not configured. Please check server configuration.' },
        { status: 500 }
      )
    }

    console.log('Calling OpenAI API with config:', {
      baseURL: 'https://api.emergent.ai/v1',
      model,
      messageCount: messages.length
    })
    
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }).catch((err) => {
      console.error('OpenAI API call failed:', {
        message: err.message,
        code: err.code,
        type: err.type,
        status: err.status
      })
      throw err
    })

    console.log('OpenAI response received:', {
      hasContent: !!completion.choices[0]?.message?.content,
      usage: completion.usage
    })

    const responseMessage = completion.choices[0]?.message?.content

    if (!responseMessage) {
      console.error('No content in OpenAI response')
      return NextResponse.json(
        { error: 'No response generated from AI' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: responseMessage,
      usage: completion.usage,
      success: true
    })
  } catch (error: any) {
    console.error('ChatGPT API Error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    })
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to get response from ChatGPT',
        details: error.response?.data?.error?.message || error.toString(),
        success: false
      },
      { status: 500 }
    )
  }
}
