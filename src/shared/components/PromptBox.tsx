"use client"

import React, { useState } from 'react'
import { Send, ShoppingCart, Coffee, Lightbulb, Settings2, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Switch } from '@/shared/components/ui/switch'
import { Textarea } from '@/shared/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/shared/components/ui/tooltip'
import { AgentOption, PromptBoxProps } from '@/shared/types/ai-agent'
import { PROMPT_LIMITS, AI_CAPABILITY_DETAILS } from '@/shared/constants'
import { cn } from '@/lib/utils'

const defaultOptions: AgentOption[] = [
  {
    id: 'amazon',
    title: 'Search on Amazon',
    description: 'Find products, supplies, and equipment on Amazon for your event',
    icon: <ShoppingCart className="w-4 h-4" />,
    enabled: true
  },
  {
    id: 'instacart',
    title: 'Search on Instacart',
    description: 'Find groceries, snacks, and food items through Instacart',
    icon: <ShoppingCart className="w-4 h-4" />,
    enabled: true
  },
  {
    id: 'restaurants',
    title: 'Scan nearby restaurant menus',
    description: 'Browse local restaurant menus and catering options near Dartmouth',
    icon: <Coffee className="w-4 h-4" />,
    enabled: true
  },
  {
    id: 'events',
    title: 'Inspire from existing Dartmouth events',
    description: 'Get ideas and inspiration from successful past events at Dartmouth',
    icon: <Lightbulb className="w-4 h-4" />,
    enabled: true
  }
]

export default function PromptBox({ onSubmit, placeholder = "Describe your event idea...", className }: PromptBoxProps) {
  const [prompt, setPrompt] = useState('')
  const [options, setOptions] = useState<AgentOption[]>(defaultOptions)
  const [showOptions, setShowOptions] = useState(false)

  const handleSubmit = () => {
    const trimmedPrompt = prompt.trim()
    if (trimmedPrompt.length >= PROMPT_LIMITS.MIN_LENGTH && trimmedPrompt.length <= PROMPT_LIMITS.MAX_LENGTH) {
      onSubmit(trimmedPrompt, options)
      setPrompt('') // Clear prompt after submission
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const toggleOption = (optionId: string) => {
    setOptions(prev => 
      prev.map(option => 
        option.id === optionId 
          ? { ...option, enabled: !option.enabled }
          : option
      )
    )
  }

  const enabledOptionsCount = options.filter(opt => opt.enabled).length
  const isValidLength = prompt.trim().length >= PROMPT_LIMITS.MIN_LENGTH && prompt.trim().length <= PROMPT_LIMITS.MAX_LENGTH
  const currentLength = prompt.length

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn("w-full max-w-4xl mx-auto", className)}>
        <Card className="border-border/60 shadow-sm py-0">
          <CardContent className="p-4 space-y-4">
            {/* Main Textarea */}
            <div className="space-y-2">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                className="min-h-[120px] text-base resize-none border-border/60 focus:border-primary/60 transition-colors placeholder:text-muted-foreground/60 bg-background/50"
              />
              
              {/* Character Count and Validation */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "transition-colors",
                    currentLength < PROMPT_LIMITS.MIN_LENGTH ? "text-muted-foreground" :
                    currentLength > PROMPT_LIMITS.MAX_LENGTH ? "text-destructive" :
                    "text-primary"
                  )}>
                    {currentLength}/{PROMPT_LIMITS.MAX_LENGTH}
                  </span>
                  {currentLength > 0 && currentLength < PROMPT_LIMITS.MIN_LENGTH && (
                    <span className="text-muted-foreground">
                      Need {PROMPT_LIMITS.MIN_LENGTH - currentLength} more characters
                    </span>
                  )}
                  {currentLength > PROMPT_LIMITS.MAX_LENGTH && (
                    <span className="text-destructive">
                      {currentLength - PROMPT_LIMITS.MAX_LENGTH} characters too many
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Capabilities Toggle */}
            <div className="border-t border-border/40 pt-4">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">AI Capabilities</span>
                  <span className="text-xs text-muted-foreground">
                    ({enabledOptionsCount} enabled)
                  </span>
                </div>
                {showOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Options Grid */}
              {showOptions && (
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {options.map((option) => {
                    const details = AI_CAPABILITY_DETAILS[option.id as keyof typeof AI_CAPABILITY_DETAILS]
                    return (
                      <div
                        key={option.id}
                        className="flex items-center justify-between p-3 rounded-md border border-border/40 hover:border-border/60 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg",
                            option.enabled ? "bg-primary/15 text-primary" : "bg-muted/60 text-muted-foreground"
                          )}>
                            {option.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">{option.title}</span>
                              <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                  <button 
                                    type="button"
                                    className="info-icon text-muted-foreground hover:text-primary transition-colors p-1 rounded-sm hover:bg-muted/50"
                                    aria-label={`More information about ${option.title}`}
                                  >
                                    <Info className="w-4 h-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent 
                                  className="tooltip-content max-w-80 p-4 bg-popover border border-border shadow-lg backdrop-blur-sm"
                                  side="top"
                                  sideOffset={8}
                                  align="center"
                                  avoidCollisions={true}
                                  collisionPadding={8}
                                >
                                  <div className="space-y-3">
                                    <div>
                                      <h4 className="font-semibold text-sm text-foreground mb-1">
                                        {details?.title}
                                      </h4>
                                      <p className="text-xs text-muted-foreground leading-relaxed">
                                        {details?.description}
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <h5 className="font-medium text-xs text-foreground mb-2">Key Features:</h5>
                                      <ul className="space-y-1">
                                        {details?.features.map((feature, index) => (
                                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                                            <span className="text-primary mt-0.5">•</span>
                                            <span>{feature}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    <div className="pt-2 border-t border-border/50">
                                      <p className="text-xs text-muted-foreground/80 italic">
                                        {details?.useCase}
                                      </p>
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {option.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={option.enabled}
                          onCheckedChange={() => toggleOption(option.id)}
                          className="ml-3"
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Submit Section */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground/80">
                Press <kbd className="px-2 py-1 mx-1 bg-muted/60 rounded text-xs font-medium border border-border/40">⌘/Ctrl + Enter</kbd> to submit
              </p>
              <Button 
                onClick={handleSubmit}
                disabled={!isValidLength}
                className="gap-2 shadow-sm cursor-pointer"
                size="lg"
              >
                <Send className="w-4 h-4" />
                Generate Event Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
