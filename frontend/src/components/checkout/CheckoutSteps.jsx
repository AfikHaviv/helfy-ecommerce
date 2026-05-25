import React from 'react';

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, name: 'Shipping' },
    { number: 2, name: 'Payment' },
    { number: 3, name: 'Review' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step.number
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.number}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-24 h-1 mx-4 ${
                  currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
