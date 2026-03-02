import { GoogleGenerativeAI } from '@google/generative-ai'
import { requireConfig } from './config'

const DEFAULT_MODEL = 'gemini-1.5-pro'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

let _genAI: GoogleGenerativeAI | null = null

function genAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const config = requireConfig()
    _genAI = new GoogleGenerativeAI(config.apiKey)
  }
  return _genAI
}

function modelName(): string {
  const config = requireConfig()
  return config.model ?? DEFAULT_MODEL
}

/**
 * Single-turn call. Returns the assistant text response.
 */
export async function llm(systemPrompt: string, userMessage: string): Promise<string> {
  const model = genAI().getGenerativeModel({
    model: modelName(),
    systemInstruction: systemPrompt,
  })
  const result = await model.generateContent(userMessage)
  return result.response.text()
}

/**
 * Multi-turn call. Takes a conversation history and returns the next assistant message.
 */
export async function llmChat(systemPrompt: string, messages: Message[]): Promise<string> {
  const model = genAI().getGenerativeModel({
    model: modelName(),
    systemInstruction: systemPrompt,
  })

  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const chat = model.startChat({ history })
  const last = messages[messages.length - 1]
  const result = await chat.sendMessage(last.content)
  return result.response.text()
}
