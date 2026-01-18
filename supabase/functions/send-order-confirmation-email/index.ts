import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  productName: string;
  platformName: string;
  platformPrice: number;
  quantity: number;
}

interface OrderConfirmationRequest {
  orderId: string;
  userEmail: string;
  userName?: string;
  totalPrice: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryEstimate?: string;
  items: OrderItem[];
  createdAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      orderId, 
      userEmail, 
      userName, 
      totalPrice,
      deliveryFee,
      grandTotal, 
      paymentMethod, 
      deliveryAddress,
      deliveryCity,
      deliveryEstimate,
      items,
      createdAt 
    }: OrderConfirmationRequest = await req.json();

    console.log(`Sending confirmation email for order ${orderId} to ${userEmail}`);

    const formattedDate = new Date(createdAt).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Generate items HTML
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #374151; font-size: 14px;">${item.productName}</span>
          <br/>
          <span style="color: #9ca3af; font-size: 12px;">via ${item.platformName}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151; font-size: 14px; font-weight: 600;">
          ₹${(item.platformPrice * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const emailResponse = await resend.emails.send({
      from: "SmartBasket <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Order Confirmed! #${orderId.slice(0, 8).toUpperCase()}`,
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
              <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 32px;">✅</span>
                <h2 style="color: #16a34a; margin: 8px 0 4px 0; font-size: 20px;">Order Confirmed!</h2>
                <p style="color: #065f46; margin: 0; font-size: 14px;">Thank you for your order</p>
              </div>
              
              <!-- Greeting -->
              <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
                Hi ${userName || 'there'},
              </p>
              
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">
                Your order has been placed successfully! Here's a summary of your order:
              </p>
              
              <!-- Order Info -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #6b7280; font-size: 14px;">Order ID:</span>
                  <span style="color: #374151; font-size: 14px; font-weight: 600;">#${orderId.slice(0, 8).toUpperCase()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #6b7280; font-size: 14px;">Order Date:</span>
                  <span style="color: #374151; font-size: 14px; font-weight: 600;">${formattedDate}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #6b7280; font-size: 14px;">Payment Method:</span>
                  <span style="color: #374151; font-size: 14px; font-weight: 600;">${paymentMethod}</span>
                </div>
                ${deliveryEstimate ? `
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6b7280; font-size: 14px;">Expected Delivery:</span>
                  <span style="color: #16a34a; font-size: 14px; font-weight: 600;">${deliveryEstimate}</span>
                </div>
                ` : ''}
              </div>
              
              <!-- Delivery Address -->
              ${deliveryAddress ? `
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h3 style="color: #374151; font-size: 14px; margin: 0 0 12px 0;">📍 Delivery Address</h3>
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  ${deliveryAddress}${deliveryCity ? `, ${deliveryCity}` : ''}
                </p>
              </div>
              ` : ''}
              
              <!-- Order Items -->
              <div style="margin-bottom: 24px;">
                <h3 style="color: #374151; font-size: 16px; margin: 0 0 16px 0;">Order Items</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Item</th>
                      <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Qty</th>
                      <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
              </div>
              
              <!-- Order Total -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #6b7280; font-size: 14px;">Subtotal:</span>
                  <span style="color: #374151; font-size: 14px;">₹${totalPrice.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #6b7280; font-size: 14px;">Delivery Fee:</span>
                  <span style="color: #374151; font-size: 14px;">${deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'FREE'}</span>
                </div>
                <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; display: flex; justify-content: space-between;">
                  <span style="color: #374151; font-size: 16px; font-weight: 600;">Total:</span>
                  <span style="color: #16a34a; font-size: 18px; font-weight: 700;">₹${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <!-- Track Order CTA -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="https://smartbasket.app/order-tracking/${orderId}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  Track Your Order
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

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation-email function:", error);
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
