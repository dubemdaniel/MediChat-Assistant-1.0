'use server';

import { analyzeSymptoms } from '@/ai/flows/analyze-symptoms';
import { generateTreatmentPlan } from '@/ai/flows/treatment-recommendation';
import { conductDoctorConsultation } from '@/ai/flows/consultation-flow';
import type { MessageContent, ConsultationState, PatientInfo } from '@/lib/types';

// Enhanced bot response system
export async function getBotResponses(
  userMessage: string, 
  consultationState?: ConsultationState
): Promise<MessageContent[]> {
  const responses: MessageContent[] = [];
  
  try {
    // Initialize consultation state if not provided
    const currentState: ConsultationState = consultationState || {
      phase: 'gathering_info',
      patientInfo: {},
      conversationHistory: [],
      urgencyLevel: 'low'
    };

    // Add user message to conversation history
    currentState.conversationHistory.push({
      sender: 'patient',
      message: userMessage,
      timestamp: new Date().toISOString()
    });

    // Conduct doctor consultation first to determine next steps
    const consultationResult = await conductDoctorConsultation({
      patientMessage: userMessage,
      conversationHistory: currentState.conversationHistory,
      currentDiagnosis: currentState.workingDiagnosis,
      gatheringInfo: currentState.phase === 'gathering_info'
    });

    // Add doctor consultation response
    responses.push({
      type: 'doctor_consultation',
      consultation: consultationResult
    });

    // Update conversation history with doctor response
    currentState.conversationHistory.push({
      sender: 'doctor',
      message: consultationResult.doctorResponse,
      timestamp: new Date().toISOString()
    });

    // Update urgency level
    currentState.urgencyLevel = consultationResult.urgencyLevel;

    // If assessment is complete, proceed with symptom analysis
    if (consultationResult.assessmentComplete && currentState.phase === 'gathering_info') {
      try {
        // Extract symptoms from conversation history
        const allSymptoms = currentState.conversationHistory
          .filter(msg => msg.sender === 'patient')
          .map(msg => msg.message)
          .join(' ');

        const analysisResult = await analyzeSymptoms({
          symptoms: allSymptoms
        });

        responses.push({
          type: 'analysis',
          analysis: analysisResult
        });

        // Update state with working diagnosis
        if (analysisResult.possibleConditions.length > 0) {
          currentState.workingDiagnosis = analysisResult.possibleConditions[0];
          currentState.phase = 'diagnosis';
        }

        // If we have a diagnosis, generate treatment plan
        if (currentState.workingDiagnosis) {
          const treatmentPlan = await generateTreatmentPlan({
            condition: currentState.workingDiagnosis,
            symptoms: allSymptoms,
            severity: mapUrgencyToSeverity(currentState.urgencyLevel),
            patientAge: currentState.patientInfo.age,
            patientAllergies: currentState.patientInfo.allergies || [],
            currentMedications: currentState.patientInfo.currentMedications || []
          });

          responses.push({
            type: 'treatment_plan',
            treatmentPlan: {
              ...treatmentPlan,
              condition: currentState.workingDiagnosis
            }
          });

          currentState.phase = 'treatment_planning';
        }
      } catch (error) {
        console.error('Error in symptom analysis or treatment planning:', error);
        responses.push({
          type: 'text',
          text: 'I apologize, but I encountered an issue while analyzing your symptoms. Let me ask you a few more questions to better understand your condition.'
        });
      }
    }

    // Handle emergency situations
    if (currentState.urgencyLevel === 'emergency') {
      responses.unshift({
        type: 'text',
        text: '🚨 URGENT: Based on your symptoms, you should seek immediate medical attention. Please go to the nearest emergency room or call emergency services right away.'
      });
    }

  } catch (error) {
    console.error('Error in bot response generation:', error);
    return [{
      type: 'text',
      text: 'I apologize, but I encountered an error. Please try rephrasing your message or start over with your symptoms.'
    }];
  }

  return responses;
}

// Helper function to map urgency to severity
function mapUrgencyToSeverity(urgency: 'low' | 'medium' | 'high' | 'emergency'): 'mild' | 'moderate' | 'severe' {
  switch (urgency) {
    case 'low':
      return 'mild';
    case 'medium':
      return 'moderate';
    case 'high':
    case 'emergency':
      return 'severe';
    default:
      return 'moderate';
  }
}

// Function to extract patient information from conversation
export async function extractPatientInfo(conversationHistory: Array<{sender: string; message: string}>): Promise<PatientInfo> {
  const patientMessages = conversationHistory
    .filter(msg => msg.sender === 'patient')
    .map(msg => msg.message.toLowerCase())
    .join(' ');

  const patientInfo: PatientInfo = {};

  // Extract age
  const ageMatch = patientMessages.match(/(\d+)\s*(years?\s*old|yo|y\.o\.)/);
  if (ageMatch) {
    patientInfo.age = parseInt(ageMatch[1]);
  }

  // Extract pain level
  const painMatch = patientMessages.match(/pain.{0,20}(\d+).{0,5}(out of|\/)\s*10/);
  if (painMatch) {
    patientInfo.painLevel = parseInt(painMatch[1]);
  }

  // Extract allergies (simple keyword detection)
  if (patientMessages.includes('allergic to') || patientMessages.includes('allergy')) {
    // This would need more sophisticated extraction in a real application
    patientInfo.allergies = ['Please specify allergies'];
  }

  // Extract current medications
  if (patientMessages.includes('taking') || patientMessages.includes('medication') || patientMessages.includes('pills')) {
    patientInfo.currentMedications = ['Please specify current medications'];
  }

  return patientInfo;
}