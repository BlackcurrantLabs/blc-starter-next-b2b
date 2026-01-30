'use client';

import { useForm } from '@tanstack/react-form';
import { useDebouncedCallback } from 'use-debounce';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Script from 'next/script';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const widgetRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      subject: '',
      message: '',
      altcha: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch('/api/contact/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(value),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to submit');
        }

        toast.success('Thank you! Your message has been sent.');
        form.reset();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Something went wrong');
      }
    },
    validators: {
      onChange: ({ value }) => {
        return undefined;
      }
    }
  });

  const debouncedSubmit = useDebouncedCallback(() => {
    form.handleSubmit();
  }, 500);

  useEffect(() => {
    const widget = widgetRef.current;
    if (!widget) return;

    const handleStateChange = (ev: Event) => {
      const customEvent = ev as CustomEvent;
      if (customEvent.detail?.state === 'verified') {
        form.setFieldValue('altcha', customEvent.detail.payload);
      }
    };

    widget.addEventListener('statechange', handleStateChange);
    return () => widget.removeEventListener('statechange', handleStateChange);
  }, [form]);

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Script 
        src="https://altcha.org/js/altcha.min.js" 
        strategy="afterInteractive" 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Send us a message and we'll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              debouncedSubmit();
            }}
            className="space-y-6"
          >
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => !value ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? 'Invalid email: TLD required' : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="you@example.com"
                    data-testid="email-input"
                  />
                  {field.state.meta.errors ? (
                    <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name="subject"
              validators={{
                onChange: ({ value }) => !value ? 'Subject is required' : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="How can we help?"
                    data-testid="subject-input"
                  />
                  {field.state.meta.errors ? (
                    <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name="message"
              validators={{
                onChange: ({ value }) => !value ? 'Message is required' : value.length > 5000 ? 'Message too long' : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Your message..."
                    className="min-h-[150px]"
                    data-testid="message-input"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{field.state.meta.errors ? <span className="text-red-500">{field.state.meta.errors.join(', ')}</span> : null}</span>
                    <span>{field.state.value.length}/5000</span>
                  </div>
                </div>
              )}
            </form.Field>

            <form.Field
              name="altcha"
              validators={{
                onChange: ({ value }) => !value ? 'Please verify you are human' : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  {/* @ts-ignore */}
                  <altcha-widget ref={widgetRef} challengeurl="/api/contact/challenge"></altcha-widget>
                  {field.state.meta.errors ? (
                    <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <Button 
              type="submit" 
              className="w-full"
              disabled={form.state.isSubmitting}
              data-testid="submit-button"
            >
              {form.state.isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
