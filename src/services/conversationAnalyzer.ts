import type { CandidateConversation } from '../types'
import type { ConversationStage, CandidateFunnelData } from '../types/funnel'

// Patterns to identify different stages
const STAGE_PATTERNS = {
  engagement: {
    patterns: [
      /hello|hi|hey|welcome|thanks for joining|let's start|good morning|good afternoon/i,
      /tell me about|share your|can you.*about yourself|introduce yourself/i,
      /thank you for|pleased to meet|nice to meet/i,
    ],
    name: 'AI Engagement',
  },
  interview: {
    patterns: [
      /experience|project|skills|worked with|proficient|comfortable with|familiar with/i,
      /how do you|what.*approach|describe.*time|can you explain/i,
      /interested|why.*company|what.*draws you|what.*motivates/i,
      /tell me about a time|give me an example|describe a situation/i,
    ],
    name: 'Interview Questions',
  },
  scheduling: {
    // AI proposes schedule slots - this is stage 3
    patterns: [
      // Primary patterns based on real message
      /momento.*agendar.*llamada|time.*schedule.*call/i,
      /llamada.*\d+.*minutos|call.*\d+.*minutes/i,
      /equipo.*factor.*humano|equipo.*HR|HR.*team|human.*resources/i,
      /horarios.*que.*tenemos|slots.*available|times.*available/i,
      /estos.*son.*los.*horarios|these.*are.*the.*times/i,
      
      // Date and time patterns
      /\d{1,2}\/\d{1,2}\/\d{4}/,  // Date format DD/MM/YYYY
      /\d{1,2}:\d{2}\s*a\s*\d{1,2}:\d{2}/,  // Time range format
      /hora.*de.*CDMX|hora.*de.*\w+|timezone/i,
      
      // Response request patterns
      /responde.*con.*el.*número|respond.*with.*number/i,
      /opción.*que.*te.*funciona|option.*that.*works/i,
      /ej\.\s*1.*2.*3.*4|e\.g\.\s*1.*2.*3.*4/i,
      
      // General scheduling patterns
      /available.*slots?|available.*times?|following.*dates?|following.*times?/i,
      /schedule.*interview|book.*interview|arrange.*meeting|set.*up.*interview/i,
      /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i,
      /Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo/i,
      /\d{1,2}:\d{2}\s*(am|pm|AM|PM)|morning|afternoon|evening/i,
      /please.*confirm|let.*know.*works|choose.*slot|select.*time/i,
      /por.*favor.*responde|please.*respond/i,
      
      // Implicit scheduling patterns (for backwards compatibility)
      /we'll.*be.*in.*touch|we.*will.*contact.*you/i,
      /get.*back.*to.*you|reach.*out.*soon/i,
      /next.*steps|moving.*forward/i,
    ],
    name: 'HR Interview Scheduling',
  },
  // AI confirms the scheduled interview - this is stage 4 (completed)
  completed: {
    patterns: [
      // Primary confirmation patterns based on real message
      /genial.*has.*seleccionado.*horario|great.*you.*selected.*time/i,
      /has.*seleccionado.*el.*horario|you.*have.*selected.*the.*time/i,
      /tu.*entrevista.*con.*el.*equipo|your.*interview.*with.*team/i,
      /voy.*a.*proceder.*a.*agendar|going.*to.*proceed.*schedule/i,
      /proceder.*a.*agendar|proceed.*to.*schedule/i,
      /te.*enviaré.*una.*invitación|send.*you.*invitation/i,
      /enviaré.*invitación.*email|send.*invitation.*email/i,
      
      // Calendar confirmation patterns
      /agendada.*exitosamente|successfully.*scheduled/i,
      /confirmada.*tu.*entrevista|confirmed.*your.*interview/i,
      /invitación.*calendario|calendar.*invitation/i,
      /nos.*vemos.*pronto.*entrevista|see.*you.*soon.*interview/i,
      /gracias.*por.*confirmar|thanks.*for.*confirming/i,
      
      // Email and meeting patterns
      /invitación.*al.*email|invitation.*to.*email/i,
      /recibirás.*confirmación|receive.*confirmation/i,
      /meeting.*scheduled|reunión.*agendada/i,
      /appointment.*confirmed|cita.*confirmada/i,
      
      // Generic completion patterns
      /interview.*scheduled|entrevista.*agendada/i,
      /booking.*confirmed|reserva.*confirmada/i,
      /see.*you.*at.*interview|nos.*vemos.*en.*entrevista/i,
    ],
    name: 'Completed',
  },
}

export const analyzeConversationStages = (
  conversation: CandidateConversation
): CandidateFunnelData => {
  console.log('🔍 Analyzing conversation for:', conversation.candidateName)
  console.log('Total messages:', conversation.messages.length)
  
  // Log all AI messages to see what we're working with
  console.log('AI Messages in conversation:')
  conversation.messages.forEach((m, i) => {
    if (m.entity === 'AI_RECRUITER') {
      console.log(`  [${i}] AI: "${m.message.substring(0, 150)}..."`)
    }
  })

  const stages: ConversationStage[] = []
  let currentStage = 'engagement'
  let interviewQuestionCount = 0
  let schedulingProposed = false
  let processCompleted = false
  let lastAIMessageIndex = -1

  // Find first AI message for engagement
  let firstAIMessageFound = false

  // Analyze each message
  conversation.messages.forEach((message, index) => {
    const isAI = message.entity === 'AI_RECRUITER'

    if (isAI) {
      lastAIMessageIndex = index

      // First AI message is always engagement
      if (!firstAIMessageFound) {
        firstAIMessageFound = true
        console.log(`  📌 Stage detected: Engagement (first AI message) at message ${index}`)
        stages.push({
          id: `engagement_${index}`,
          name: STAGE_PATTERNS.engagement.name,
          type: 'engagement',
          timestamp: message.timestamp,
          message: message.message,
          completed: false,
        })
        return
      }

      // Check for completed/confirmation patterns (AI confirms interview) - Stage 4
      if (currentStage === 'scheduling_responded' && !processCompleted) {
        const completedMatch = STAGE_PATTERNS.completed.patterns.some((pattern) => {
          const matches = pattern.test(message.message)
          if (matches) {
            console.log(`    ✅ Completion pattern matched: ${pattern}`)
          }
          return matches
        })
        
        if (completedMatch) {
          console.log(`  ✅ Stage 4 detected: Completed (AI confirmed interview) at message ${index}`)
          console.log(`    Message: "${message.message.substring(0, 200)}..."`)
          processCompleted = true
          stages.push({
            id: `completed_${index}`,
            name: STAGE_PATTERNS.completed.name,
            type: 'completed',
            timestamp: message.timestamp,
            message: message.message,
            completed: true,
          })
          currentStage = 'completed'
          return
        }
      }

      // Check for scheduling patterns (AI proposes times) - Stage 3
      // Also check if we're late in the conversation (after many questions)
      const isLateInConversation = interviewQuestionCount >= 5 || index > conversation.messages.length * 0.7
      
      const schedulingMatch = STAGE_PATTERNS.scheduling.patterns.some((pattern) => {
        const matches = pattern.test(message.message)
        if (matches) {
          console.log(`    🔍 Scheduling pattern matched: ${pattern} in message: "${message.message.substring(0, 100)}..."`)
        }
        return matches
      })
      
      // More lenient detection for scheduling stage
      const maybeScheduling = message.message.toLowerCase().includes('next') && 
                            (message.message.toLowerCase().includes('step') || 
                             message.message.toLowerCase().includes('interview') ||
                             message.message.toLowerCase().includes('round'))
      
      if ((schedulingMatch || (maybeScheduling && isLateInConversation)) && !schedulingProposed) {
        console.log(`  📌 Stage 3 detected: HR Interview Scheduling at message ${index}`)
        console.log(`    Message: "${message.message.substring(0, 200)}..."`)
        console.log(`    Detected by: ${schedulingMatch ? 'pattern match' : 'context (late conversation + next steps)'}`)
        currentStage = 'scheduling'
        schedulingProposed = true
        stages.push({
          id: `scheduling_${index}`,
          name: STAGE_PATTERNS.scheduling.name,
          type: 'scheduling',
          timestamp: message.timestamp,
          message: message.message,
          completed: false,
        })
        return
      }

      // Check for interview patterns or questions
      const isInterviewPattern = STAGE_PATTERNS.interview.patterns.some((pattern) =>
        pattern.test(message.message)
      )
      const hasQuestion = message.message.includes('?')

      if (
        (currentStage === 'engagement' && isInterviewPattern) ||
        (currentStage === 'interview' && hasQuestion) ||
        (currentStage === 'engagement' && hasQuestion && index > 0)
      ) {
        // Limit to 10 questions maximum
        if (interviewQuestionCount < 10) {
          console.log(`  📌 Stage detected: Interview Question at message ${index}`)
          interviewQuestionCount++
          stages.push({
            id: `interview_${interviewQuestionCount}`,
            name: `Interview Question ${interviewQuestionCount}`,
            type: 'interview',
            subStage: `2.${interviewQuestionCount}`,
            timestamp: message.timestamp,
            message: message.message,
            completed: false,
          })
          currentStage = 'interview'
        } else {
          console.log(`  ⚠️ Skipping interview question ${interviewQuestionCount + 1} (max 10 reached)`)
        }
        return
      }
    } else {
      // User response
      
      // User responds to scheduling (typically with a number)
      if (currentStage === 'scheduling' && schedulingProposed) {
        console.log(`    🔍 User response after scheduling proposal: "${message.message.substring(0, 100)}..."`)
        // Mark that user has responded to scheduling
        currentStage = 'scheduling_responded'
      }
      
      // Mark previous stage as completed when user responds
      if (stages.length > 0 && stages[stages.length - 1].type !== 'completed') {
        console.log(`  ✅ Marking stage ${stages[stages.length - 1].name} as completed`)
        stages[stages.length - 1].completed = true
      }
    }
  })

  // If we have a positive ending without explicit scheduling, infer stages 3 and 4
  if (!schedulingProposed && conversation.messages.length > 4) {
    const lastAIMessage = conversation.messages
      .slice()
      .reverse()
      .find(m => m.entity === 'AI_RECRUITER')
    const lastUserMessage = conversation.messages[conversation.messages.length - 1]
    
    if (lastAIMessage && lastUserMessage.entity !== 'AI_RECRUITER') {
      // Check if AI indicated future contact
      const hasImplicitScheduling = STAGE_PATTERNS.scheduling.patterns.some(pattern => 
        pattern.test(lastAIMessage.message)
      )
      
      if (hasImplicitScheduling) {
        console.log('  📌 Implicit scheduling detected in final AI message')
        stages.push({
          id: `scheduling_implicit`,
          name: STAGE_PATTERNS.scheduling.name,
          type: 'scheduling',
          timestamp: lastAIMessage.timestamp,
          message: lastAIMessage.message,
          completed: true,
        })
        
        // Check if user responded positively
        const hasPositiveResponse = STAGE_PATTERNS.completed.patterns.some(pattern =>
          pattern.test(lastUserMessage.message)
        )
        
        if (hasPositiveResponse) {
          console.log('  ✅ Implicit completion detected in final user response')
          stages.push({
            id: `completed_implicit`,
            name: STAGE_PATTERNS.completed.name,
            type: 'completed',
            timestamp: lastUserMessage.timestamp,
            message: lastUserMessage.message,
            completed: true,
          })
        }
      }
    }
  }

  console.log(`📊 Total stages found: ${stages.length}`)
  console.log(
    'Stages:',
    stages.map((s) => ({
      name: s.name,
      type: s.type,
      completed: s.completed,
    }))
  )

  // Calculate duration from start to last message
  const startTime = conversation.startTime
  const endTime = conversation.messages[conversation.messages.length - 1]?.timestamp || conversation.endTime
  const totalDuration = endTime.getTime() - startTime.getTime()

  // Determine if candidate dropped and where
  let droppedAt: string | undefined
  const lastStage = stages[stages.length - 1]
  if (lastStage && !lastStage.completed && lastStage.type !== 'completed') {
    droppedAt = lastStage.name
  }
  
  // Process is completed when we have a 'completed' stage
  const hasCompletedStage = stages.some(stage => stage.type === 'completed')

  return {
    candidateId: conversation.candidateId,
    candidateName: conversation.candidateName,
    stages,
    currentStage: stages[stages.length - 1]?.name || 'Unknown',
    decisionMade: hasCompletedStage,
    decisionType: hasCompletedStage ? 'PASS' : undefined,
    decisionTimestamp: hasCompletedStage ? stages.find(s => s.type === 'completed')?.timestamp : undefined,
    totalDuration,
    droppedAt,
  }
}

export const calculateFunnelMetrics = (
  candidateFunnels: CandidateFunnelData[]
): FunnelStageMetrics[] => {
  console.log('📈 Calculating funnel metrics for', candidateFunnels.length, 'candidates')

  const stageMetricsMap = new Map<
    string,
    {
      entered: Set<string>
      completed: Set<string>
      dropped: Set<string>
      times: number[]
      subStages: Map<string, { entered: Set<string>; completed: Set<string>; times: number[] }>
    }
  >()

  // Initialize main stages (4 stages now)
  const mainStages = ['AI Engagement', 'Interview Questions', 'HR Interview Scheduling', 'Completed']
  mainStages.forEach((stage) => {
    stageMetricsMap.set(stage, {
      entered: new Set(),
      completed: new Set(),
      dropped: new Set(),
      times: [],
      subStages: new Map(),
    })
  })

  // Process each candidate's funnel
  candidateFunnels.forEach((funnel) => {
    let previousStageTime: number | null = null

    funnel.stages.forEach((stage) => {
      const mainStageName = stage.type === 'interview' ? 'Interview Questions' : stage.name
      const metrics = stageMetricsMap.get(mainStageName)

      if (metrics) {
        // Count as entered for all non-simulated stages
        if (!stage.id.includes('simulated')) {
          metrics.entered.add(funnel.candidateId)
        }

        if (stage.completed) {
          metrics.completed.add(funnel.candidateId)
        }

        // Calculate time in stage
        let timeInStage = 0
        if (previousStageTime !== null && !stage.id.includes('simulated')) {
          timeInStage = stage.timestamp.getTime() - previousStageTime
          // Only add positive time values
          if (timeInStage > 0) {
            metrics.times.push(timeInStage)
            console.log(`    Time in stage ${stage.name}: ${timeInStage}ms`)
          }
        }
        
        // Update previous time for next calculation
        if (!stage.id.includes('simulated')) {
          previousStageTime = stage.timestamp.getTime()
        }

        // Handle substages for interview questions
        if (stage.type === 'interview' && stage.subStage) {
          if (!metrics.subStages.has(stage.subStage)) {
            metrics.subStages.set(stage.subStage, {
              entered: new Set(),
              completed: new Set(),
              times: [],
            })
          }
          const subMetrics = metrics.subStages.get(stage.subStage)!
          subMetrics.entered.add(funnel.candidateId)
          if (stage.completed) {
            subMetrics.completed.add(funnel.candidateId)
          }
          
          // For substages, use the same time calculation
          if (timeInStage > 0) {
            subMetrics.times.push(timeInStage)
          }
        }
      }
    })

    // Mark where candidate dropped
    if (funnel.droppedAt) {
      const droppedMetrics = stageMetricsMap.get(funnel.droppedAt)
      if (droppedMetrics) {
        droppedMetrics.dropped.add(funnel.candidateId)
      }
    }
  })

  // Convert to array format
  console.log('Stage metrics summary:')
  stageMetricsMap.forEach((metrics, stageName) => {
    console.log(
      `  ${stageName}: entered=${metrics.entered.size}, completed=${metrics.completed.size}, dropped=${metrics.dropped.size}`
    )
  })

  return mainStages.map((stageName) => {
    const metrics = stageMetricsMap.get(stageName)!
    const candidatesEntered = metrics.entered.size
    const candidatesCompleted = metrics.completed.size
    const candidatesDropped = metrics.dropped.size

    const subStages = Array.from(metrics.subStages.entries())
      .map(([subStageId, subMetrics]) => {
        const questionNumber = parseInt(subStageId.split('.')[1])
        return {
          stageName: `Question ${questionNumber}`,
          stageId: subStageId,
          questionNumber, // Add for sorting
          candidatesEntered: subMetrics.entered.size,
          candidatesCompleted: subMetrics.completed.size,
          candidatesDropped: 0,
          conversionRate:
            subMetrics.entered.size > 0
              ? (subMetrics.completed.size / subMetrics.entered.size) * 100
              : 0,
          avgTimeInStage:
            subMetrics.times.length > 0
              ? subMetrics.times.reduce((a, b) => a + b, 0) / subMetrics.times.length
              : 0,
        }
      })
      .filter(subStage => subStage.questionNumber <= 10) // Only keep questions 1-10
      .sort((a, b) => a.questionNumber - b.questionNumber) // Sort numerically

    return {
      stageName,
      stageId: stageName.toLowerCase().replace(/\s+/g, '_'),
      candidatesEntered,
      candidatesCompleted,
      candidatesDropped,
      conversionRate: candidatesEntered > 0 ? (candidatesCompleted / candidatesEntered) * 100 : 0,
      avgTimeInStage:
        metrics.times.length > 0
          ? metrics.times.reduce((a, b) => a + b, 0) / metrics.times.length
          : 0,
      subStages: subStages.length > 0 ? subStages : undefined,
    }
  })
}
