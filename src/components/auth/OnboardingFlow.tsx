import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CheckCircle, Circle, ArrowRight, Shield, CreditCard, User, Building } from 'lucide-react';
import { VerificationFlow } from './VerificationFlow';
import { PaymentConnect } from './PaymentConnect';
import { SecurityDashboard } from './SecurityDashboard';

interface OnboardingFlowProps {
  user: any;
  userType: 'customer' | 'merchant';
  onComplete?: () => void;
}

export function OnboardingFlow({ user, userType, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      title: 'Welcome to PayEase',
      description: 'Get started with your account setup',
      icon: User,
      component: 'welcome'
    },
    {
      id: 2,
      title: 'Verify Your Account',
      description: 'Complete email and phone verification',
      icon: Shield,
      component: 'verification'
    },
    {
      id: 3,
      title: 'Connect Payment Method',
      description: 'Add secure payment options',
      icon: CreditCard,
      component: 'payment'
    },
    ...(userType === 'merchant' ? [{
      id: 4,
      title: 'Business Verification',
      description: 'Complete business documentation',
      icon: Building,
      component: 'business'
    }] : [])
  ];

  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);
  const isStepCurrent = (stepId: number) => stepId === currentStep;
  const isStepAccessible = (stepId: number) => stepId <= currentStep || isStepCompleted(stepId);

  const handleStepComplete = (stepId: number) => {
    if (!isStepCompleted(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    const nextStep = stepId + 1;
    if (nextStep <= steps.length) {
      setCurrentStep(nextStep);
    } else {
      onComplete?.();
    }
  };

  const progressPercentage = (completedSteps.length / steps.length) * 100;

  const renderStepContent = () => {
    const step = steps.find(s => s.id === currentStep);
    if (!step) return null;

    switch (step.component) {
      case 'welcome':
        return (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Welcome to PayEase!</CardTitle>
              <CardDescription className="text-lg">
                {userType === 'customer' 
                  ? 'Start your Buy Now, Pay Later journey with flexible payment plans'
                  : 'Grow your business with flexible payment solutions for your customers'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-1">Secure</h4>
                  <p className="text-sm text-muted-foreground">
                    Bank-level encryption and fraud protection
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-1">Flexible</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose payment plans that work for you
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium mb-1">Simple</h4>
                  <p className="text-sm text-muted-foreground">
                    Easy setup and intuitive interface
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={() => handleStepComplete(1)} className="btn-gradient">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'verification':
        return (
          <VerificationFlow 
            user={user} 
            userType={userType}
            onVerificationComplete={() => handleStepComplete(2)}
          />
        );

      case 'payment':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Payment Method</CardTitle>
              <CardDescription>
                Add a secure payment method to start using PayEase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentConnect 
                onConnect={() => handleStepComplete(3)}
                variant="primary"
                showMultiple={true}
              />
            </CardContent>
          </Card>
        );

      case 'business':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Business Verification</CardTitle>
              <CardDescription>
                Complete your business verification to access merchant features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VerificationFlow 
                user={user} 
                userType={userType}
                onVerificationComplete={() => handleStepComplete(4)}
              />
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Account Setup
            </h1>
            <p className="text-muted-foreground">
              Complete these steps to unlock all PayEase features
            </p>
          </div>

          <div className="mb-4">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{completedSteps.length} of {steps.length} completed</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const completed = isStepCompleted(step.id);
              const current = isStepCurrent(step.id);
              const accessible = isStepAccessible(step.id);
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      completed 
                        ? 'bg-green-100 text-green-600 border-2 border-green-600' 
                        : current 
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                        : accessible
                        ? 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                        : 'bg-gray-50 text-gray-300 border-2 border-gray-200'
                    }`}
                  >
                    {completed ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-medium ${
                      current ? 'text-blue-600' : completed ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block absolute w-24 h-0.5 mt-6 ml-24 ${
                      completed ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {completedSteps.length === steps.length && (
            <Button onClick={onComplete} className="btn-gradient">
              Complete Setup
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
            disabled={currentStep === steps.length || !isStepCompleted(currentStep)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}