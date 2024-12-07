"use client"

import OpenAI from 'openai'
import { AgentPersonality } from '@/lib/types/agent'
import { Department } from '@/lib/stores/department-store'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export class OpenAIService {
  private async generateSystemPrompt(agent: AgentPersonality, department: Department) {
    return `You are ${agent.name}, an AI assistant specializing in ${department.name}.
Your role is ${agent.role} and you have expertise in ${agent.expertise.join(", ")}.
Your personality traits are: ${agent.traits.join(", ")}.
Communication style: ${agent.communicationStyle}.

Department description: ${department.description}

Respond to user queries in a way that:
1. Reflects your personality traits and communication style
2. Leverages your expertise to provide actionable insights
3. Stays focused on the department's objectives
4. Provides specific, practical recommendations
5. Uses data and analytics when relevant`
  }

  public async generateResponse(
    message: string,
    agent: AgentPersonality,
    department: Department,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[]
  ) {
    const systemPrompt = await this.generateSystemPrompt(agent, department)
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory,
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      return completion.choices[0].message.content
    } catch (error) {
      console.error('OpenAI API error:', error)
      return "I apologize, but I'm having trouble processing your request at the moment. Please try again."
    }
  }
}

export const openAIService = new OpenAIService()