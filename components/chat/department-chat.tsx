"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Department } from "@/lib/stores/department-store"
import { defaultAgents, AgentPersonality } from "@/lib/types/agent"
import { ChatMessage } from "@/lib/types/chat"
import { ChatMessageList } from "./chat-message-list"
import { ChatInput } from "./chat-input"
import { AgentAvatar } from "./agent-avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings2, Maximize2, Minimize2, Trash2 } from "lucide-react"
import { openAIService } from "@/lib/ai/openai-service"
import { useChatStore } from "@/lib/stores/chat-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AgentConfigForm } from "./agent-config-form"

interface DepartmentChatProps {
  department: Department
}

export function DepartmentChat({ department }: DepartmentChatProps) {
  const { getHistory, addMessage, clearHistory } = useChatStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [agent, setAgent] = useState<AgentPersonality>(defaultAgents[department.type])
  const [configOpen, setConfigOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const history = getHistory(department.id)
    if (history.length === 0) {
      const greeting: ChatMessage = {
        id: "greeting",
        type: "text",
        content: `Hi! I'm ${agent.name}, your ${agent.role}. I'm here to help you optimize your ${department.name}. How can I assist you today?`,
        sender: "agent",
        timestamp: new Date().toISOString()
      }
      addMessage(department.id, greeting)
      setMessages([greeting])
    } else {
      setMessages(history)
    }
  }, [department.id, agent, department.name, getHistory, addMessage])

  const handleSendMessage = async (content: string, type: ChatMessage['type'] = 'text') => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      sender: "user",
      timestamp: new Date().toISOString()
    }
    
    addMessage(department.id, userMessage)
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      const conversationHistory = messages
        .filter(msg => msg.id !== "greeting")
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant' as const,
          content: msg.content
        }))

      const response = await openAIService.generateResponse(
        content,
        agent,
        department,
        conversationHistory
      )

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "text",
        content: response || "I apologize, but I couldn't generate a response.",
        sender: "agent",
        timestamp: new Date().toISOString()
      }
      
      addMessage(department.id, aiMessage)
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "text",
        content: "I apologize, but I'm having trouble processing your request. Please try again.",
        sender: "agent",
        timestamp: new Date().toISOString()
      }
      addMessage(department.id, errorMessage)
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleUpdateAgent = (updatedAgent: AgentPersonality) => {
    setAgent(updatedAgent)
    setConfigOpen(false)
  }

  const handleClearHistory = () => {
    clearHistory(department.id)
    const greeting: ChatMessage = {
      id: "greeting",
      type: "text",
      content: `Hi! I'm ${agent.name}, your ${agent.role}. I'm here to help you optimize your ${department.name}. How can I assist you today?`,
      sender: "agent",
      timestamp: new Date().toISOString()
    }
    addMessage(department.id, greeting)
    setMessages([greeting])
  }

  return (
    <Card className="bg-background border-2 transition-colors hover:border-primary/50">
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <AgentAvatar agent={agent} size="lg" />
          <div>
            <h2 className="text-lg font-semibold">{agent.name}</h2>
            <p className="text-sm text-muted-foreground">{agent.role}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearHistory}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear chat history</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isExpanded ? "Minimize chat" : "Maximize chat"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog open={configOpen} onOpenChange={setConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configure AI Agent</DialogTitle>
              </DialogHeader>
              <AgentConfigForm 
                agent={agent}
                onSubmit={handleUpdateAgent}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className={`flex flex-col transition-all duration-300 ${
          isExpanded ? "h-[calc(100vh-16rem)]" : "h-[400px]"
        }`}>
          <ChatMessageList 
            messages={messages} 
            isTyping={isTyping} 
            departmentType={department.type}
          />
          <ChatInput 
            onSend={handleSendMessage} 
            disabled={isTyping}
            autoFocus={true}
          />
        </div>
      </CardContent>
    </Card>
  )
}