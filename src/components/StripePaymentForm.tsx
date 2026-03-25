import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { motion } from 'motion/react';
import { CreditCard, ShieldCheck } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

export default function StripePaymentForm({ amount, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        onError(backendError);
        setIsProcessing(false);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement) as any,
        },
      });

      if (stripeError) {
        onError(stripeError.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      onError(err.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-dark border border-white/10 rounded-[2rem] p-8">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-[#ffcc00]" />
          <span className="text-white font-black uppercase tracking-tighter">Card Details</span>
        </div>
        
        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#fff',
                  '::placeholder': {
                    color: 'rgba(255, 255, 255, 0.2)',
                  },
                },
                invalid: {
                  color: '#ff3c38',
                },
              },
            }}
          />
        </div>

        <div className="flex items-center gap-2 mt-6 text-white/20">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Secure SSL Encrypted Payment</span>
        </div>
      </div>

      <button 
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-6 bg-[#ffcc00] hover:bg-[#ffcc00]/90 text-black rounded-[2rem] font-black text-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-[0_20px_50px_rgba(255,204,0,0.3)] uppercase tracking-widest"
      >
        {isProcessing ? "Processing..." : `Pay Rs. ${amount}`}
      </button>
    </form>
  );
}
