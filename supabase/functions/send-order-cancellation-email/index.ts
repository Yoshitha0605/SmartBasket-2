import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderCancellationRequest {
  orderId: string;
  userPhone?: string;
  userName?: string;
  grandTotal: number;
  paymentMethod: string;
  cancelledAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, userPhone, userName, grandTotal, paymentMethod, cancelledAt }: OrderCancellationRequest = await req.json();

    // Generate internal email for notification (based on userPhone)
    const userEmail = userPhone 
      ? `${userPhone.replace(/\D/g, '')}@smartbasket.app`
      : null;

    if (!userEmail) {
      console.log(`No phone provided for order ${orderId}`);
      return new Response(
        JSON.stringify({ error: "No phone provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending cancellation notification for order ${orderId} to ${userPhone}`);

    const formattedDate = new Date(cancelledAt).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const emailResponse = await resend.emails.send({
      from: "SmartBasket <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Order Cancelled - #${orderId.slice(0, 8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #16a34a; font-size: 24px; margin: 0;">🛒 SmartBasket</h1>
              </div>
              
              <!-- Status Banner -->
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 32px;">❌</span>
                <h2 style="color: #dc2626; margin: 8px 0 4px 0; font-size: 20px;">Order Cancelled</h2>
                <p style="color: #991b1b; margin: 0; font-size: 14px;">Your order has been successfully cancelled</p>
              </div>
              
              <!-- Greeting -->
              <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
                Hi ${userName || 'there'},
              </p>
              
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">
                We've received your cancellation request and your order has been cancelled. Here are the details:
              </p>
              
              <!-- Order Details -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h3 style="color: #374151; font-size: 16px; margin: 0 0 16px 0;">Order Details</h3>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #6b7280; font-size: 14px;">Order ID:</span>
                  <span style="color: #374151; font-size: 14px; font-weight: 600;">#${orderId.slice(0, 8).toUpperCase()}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #6b7280; font-size: 14px;">Amount:</span>
                  <span style="color: #374151; font-size: 14px; font-weight: 600;">₹${grandTotal.toFixed(2)}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #6b7280; font-size: 14px;">Payment Method:</span>
                  <span style="color: #374151; font-size: 14px; font-weight: 600;">${paymentMethod}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6b7280; font-size: 14px;">Cancelled On:</span>
                  <span style="color: #374151; font-size: 14px; font-weight: 600;">${formattedDate}</span>
                </div>
              </div>
              
              <!-- Refund Info -->
              <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #065f46; font-size: 14px; margin: 0;">
                  <strong>💰 Refund Status:</strong> If you've already paid, your refund will be processed within 5-7 business days to your original payment method.
                </p>
              </div>
              
              <!-- CTA -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="https://smartbasket.app" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  Continue Shopping
                </a>
              </div>
              
              <!-- Footer -->
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  Need help? Contact us at support@smartbasket.app
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                  © ${new Date().getFullYear()} SmartBasket. All rights reserved.
                </p>
              </div>
              
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Cancellation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-cancellation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
