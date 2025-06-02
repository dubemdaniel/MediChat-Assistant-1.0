// Enhanced types for the medical chat system

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: MessageContent;
  timestamp: Date;
}

export type MessageContent = 
  | { type: 'text'; text: string }
  | { type: 'analysis'; analysis: AnalysisContent }
  | { type: 'treatment_plan'; treatmentPlan: TreatmentPlanContent }
  | { type: 'doctor_consultation'; consultation: DoctorConsultationContent }
  | { type: 'loading' };

export interface AnalysisContent {
  possibleConditions: string[];
  confidenceLevels: number[];
  reasoning: string;
}

export interface TreatmentPlanContent {
  condition: string;
  immediateActions: string[];
  medications: Medication[];
  lifestyle: string[];
  dietaryAdvice: string[];
  followUp: {
    timeframe: string;
    conditions: string[];
  };
  preventiveMeasures: string[];
  warnings: string[];
  reasoning: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  otc: boolean;
}

export interface DoctorConsultationContent {
  doctorResponse: string;
  followUpQuestions: string[];
  assessmentComplete: boolean;
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  nextSteps: string[];
  empathy: string;
}

// Patient information interface for storing consultation data
export interface PatientInfo {
  age?: number;
  allergies?: string[];
  currentMedications?: string[];
  medicalHistory?: string[];
  currentSymptoms?: string;
  symptomDuration?: string;
  painLevel?: number;
}

// Consultation state management
export interface ConsultationState {
  phase: 'gathering_info' | 'diagnosis' | 'treatment_planning' | 'follow_up';
  patientInfo: PatientInfo;
  workingDiagnosis?: string;
  conversationHistory: Array<{
    sender: 'patient' | 'doctor';
    message: string;
    timestamp: string;
  }>;
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
}