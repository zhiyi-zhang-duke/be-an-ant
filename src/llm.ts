import Anthropic from '@anthropic-ai/sdk'
import { requireConfig } from './config'

const DEFAULT_MODEL = 'claude-opus-4-6'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

let _client: Anthropic | null = null

function client(): Anthropic {
  if (!_client) {
    const config = requireConfig()
    _client = new Anthropic({ apiKey: config.apiKey })
  }
  return _client
}

function model(): string {
  const config = requireConfig()
  return config.model ?? DEFAULT_MODEL
}

/**
 * Single-turn call. Returns the assistant text response.
 */
export async function llm(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await client().messages.create({
    model: model(),
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Unexpected response type from LLM')
  return block.text
}

/**
 * Multi-turn call. Takes a conversation history and returns the next assistant message.
 */
export async function llmChat(systemPrompt: string, messages: Message[]): Promise<string> {
  const response = await client().messages.create({
    model: model(),
    max_tokens: 4096,
    system: systemPrompt,
    messages,
  })

  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Unexpected response type from LLM')
  return block.text
}
