export interface AgentOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  enabled: boolean
}

export interface PromptBoxProps {
  onSubmit: (prompt: string, options: AgentOption[]) => void
  placeholder?: string
  className?: string
}
