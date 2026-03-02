import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { requireConfig } from './config'

const DEFAULT_MODELS: Record<string, string> = {
  anthropic: 'claude-opus-4-6',
  google: 'gemini-2.5-flash',
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

function resolveModel(): { provider: 'anthropic' | 'google'; model: string } {
  const config = requireConfig()
  const provider = config.provider ?? 'google'
  const model = config.model ?? DEFAULT_MODELS[provider]
  return { provider, model }
}

/**
 * Single-turn call. Returns the assistant text response.
 */
export async function llm(systemPrompt: string, userMessage: string): Promise<string> {
  const { provider, model } = resolveModel()
  const config = requireConfig()

  if (provider === 'anthropic') {
    const client = new Anthropic({ apiKey: config.apiKey })
    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })
    const block = response.content[0]
    if (block.type !== 'text') throw new Error('Unexpected response type from LLM')
    return block.text
  }

  const genAI = new GoogleGenerativeAI(config.apiKey)
  const gemini = genAI.getGenerativeModel({ model, systemInstruction: systemPrompt })
  const result = await gemini.generateContent(userMessage)
  return result.response.text()
}

/**
 * Multi-turn call. Takes a conversation history and returns the next assistant message.
 */
export async function llmChat(systemPrompt: string, messages: Message[]): Promise<string> {
  const { provider, model } = resolveModel()
  const config = requireConfig()

  if (provider === 'anthropic') {
    const client = new Anthropic({ apiKey: config.apiKey })
    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    })
    const block = response.content[0]
    if (block.type !== 'text') throw new Error('Unexpected response type from LLM')
    return block.text
  }

  const genAI = new GoogleGenerativeAI(config.apiKey)
  const gemini = genAI.getGenerativeModel({ model, systemInstruction: systemPrompt })
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  const chat = gemini.startChat({ history })
  const last = messages[messages.length - 1]
  const result = await chat.sendMessage(last.content)
  return result.response.text()
}
