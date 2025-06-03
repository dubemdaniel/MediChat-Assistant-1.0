import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Bot,
  User,
  Info,
  AlertTriangle,
  Heart,
  Pill,
  Calendar,
  Shield,
  Clock,
  Stethoscope,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onFollowUpClick?: (question: string) => void;
}

export default function ChatMessageBubble({
  message,
  onFollowUpClick,
}: ChatMessageBubbleProps) {
  const isUser = message.sender === "user";
  const [formattedTimestamp, setFormattedTimestamp] = useState<string | null>(
    null
  );

  useEffect(() => {
    setFormattedTimestamp(
      new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [message.timestamp]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const renderContent = () => {
    switch (message.content.type) {
      case "text":
        return <p className="whitespace-pre-wrap  text-sm">{message.content.text}</p>;

      case "doctor_consultation":
        const { consultation } = message.content;
        return (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Stethoscope size={20} /> Dr. MediChat
              </CardTitle>
              {consultation.empathy && (
                <CardDescription className="italic text-blue-600">
                  {consultation.empathy}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm">
                <p>{consultation.doctorResponse}</p>
              </div>

              {consultation.urgencyLevel !== "low" && (
                <Alert className={getUrgencyColor(consultation.urgencyLevel)}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>
                      Urgency Level: {consultation.urgencyLevel.toUpperCase()}
                    </strong>
                    {consultation.urgencyLevel === "emergency" && (
                      <span className="block mt-1">
                        Please seek immediate medical attention!
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {consultation.followUpQuestions.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-semibold text-sm flex items-center gap-1">
                    <Heart size={16} className="text-pink-500" />
                    I'd like to know more:
                  </h5>
                  <div className="grid gap-2">
                    {consultation.followUpQuestions.map((question, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="text-left justify-start h-auto p-3 whitespace-normal cursor-default pointer-events-none opacity-70"
                        // onClick={() => onFollowUpClick && onFollowUpClick(question)}
                        // disabled
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {consultation.nextSteps.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-semibold text-sm flex items-center gap-1">
                    <Calendar size={16} className="text-blue-500" />
                    Next Steps:
                  </h5>
                  <ul className="space-y-1 text-sm">
                    {consultation.nextSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "analysis":
        const { possibleConditions, confidenceLevels, reasoning } =
          message.content.analysis;
        return (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Info size={20} /> Diagnostic Assessment
              </CardTitle>
              <CardDescription>
                Based on your symptoms, here are the most likely conditions:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {possibleConditions && possibleConditions.length > 0 ? (
                <>
                  <ul className="space-y-2">
                    {possibleConditions.map((condition, index) => (
                      <li
                        key={condition}
                        className="p-3 border rounded-md bg-secondary/50"
                      >
                        <div className="flex justify-between items-center gap-3">
                          <span className="font-semibold text-secondary-foreground">
                            {condition}
                          </span>
                          {confidenceLevels &&
                            confidenceLevels[index] !== undefined && (
                              <Badge variant="outline" className="text-xs">
                                {(confidenceLevels[index] * 100).toFixed(0)}%
                                match
                              </Badge>
                            )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {reasoning && (
                    <div className="mt-3 pt-3 border-t">
                      <h4 className="font-semibold text-sm mb-1 text-muted-foreground">
                        Clinical Reasoning:
                      </h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {reasoning}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">
                  No specific conditions identified. Please provide more
                  details.
                </p>
              )}
            </CardContent>
          </Card>
        );

      case "treatment_plan":
        const { treatmentPlan } = message.content;
        return (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Pill size={20} /> Treatment Plan
              </CardTitle>
              <CardDescription>
                Comprehensive treatment recommendations for:{" "}
                <strong>{treatmentPlan.condition}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Immediate Actions */}
              {treatmentPlan.immediateActions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-red-600">
                    <AlertTriangle size={16} />
                    Immediate Actions
                  </h4>
                  <ul className="space-y-1 text-sm pl-4">
                    {treatmentPlan.immediateActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Medications */}
              {treatmentPlan.medications.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2 text-blue-600">
                    <Pill size={16} />
                    Medications
                  </h4>
                  <div className="grid gap-3">
                    {treatmentPlan.medications.map((med, i) => (
                      <Card key={i} className="p-3 bg-blue-50/50">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-blue-800">
                            {med.name}
                          </h5>
                          <Badge variant={med.otc ? "secondary" : "default"}>
                            {med.otc ? "OTC" : "Prescription"}
                          </Badge>
                        </div>
                        <div className="text-sm space-y-1">
                          <p>
                            <strong>Dosage:</strong> {med.dosage}
                          </p>
                          <p>
                            <strong>Frequency:</strong> {med.frequency}
                          </p>
                          <p>
                            <strong>Duration:</strong> {med.duration}
                          </p>
                          {med.instructions && (
                            <p>
                              <strong>Instructions:</strong> {med.instructions}
                            </p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Lifestyle Recommendations */}
              {treatmentPlan.lifestyle.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-green-600">
                    <Heart size={16} />
                    Lifestyle Recommendations
                  </h4>
                  <ul className="space-y-1 text-sm pl-4">
                    {treatmentPlan.lifestyle.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dietary Advice */}
              {treatmentPlan.dietaryAdvice.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-orange-600">
                    🍎 Dietary Recommendations
                  </h4>
                  <ul className="space-y-1 text-sm pl-4">
                    {treatmentPlan.dietaryAdvice.map((advice, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{advice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-purple-600">
                  <Calendar size={16} />
                  Follow-up Care
                </h4>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>Schedule follow-up:</strong>{" "}
                    {treatmentPlan.followUp.timeframe}
                  </p>
                  {treatmentPlan.followUp.conditions.length > 0 && (
                    <div>
                      <p className="font-medium text-red-600">
                        Seek immediate care if you experience:
                      </p>
                      <ul className="pl-4 mt-1">
                        {treatmentPlan.followUp.conditions.map(
                          (condition, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{condition}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>{" "}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <p className="italic text-muted-foreground">
            Unsupported message type.
          </p>
        );
    }
  };

  return (
    <div
      className={cn("my-4 flex", {
        "justify-end": isUser,
        "justify-start": !isUser,
      })}
    >
      <div
        className={cn("max-w-xl w-fit", isUser ? "text-right" : "text-left")}
      >
        <div
          className={cn(
            "rounded-lg p-3",
            isUser
              ? "bg-primary text-white ml-auto"
              : "bg-muted border text-muted-foreground"
          )}
        >
          {renderContent()}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {formattedTimestamp}
        </div>
      </div>
    </div>
  );
}
