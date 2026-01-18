import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderStatusEmailRequest {
  orderId: string;
  userEmail: string;
  userName: string;
  status: string;
  grandTotal: number;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryEstimate?: string;
  items: Array<{
    productName: string;
    platformName: string;
    quantity: number;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      orderId,
      userEmail,
      userName,
      status,
      grandTotal,
      deliveryAddress,
      deliveryCity,
      deliveryEstimate,
      items,
    }: OrderStatusEmailRequest = await req.json();

    const statusEmoji = status === 'Out for Delivery' ? '🚚' : '📦';
    const statusMessage = status === 'Out for Delivery' 
      ? 'Your order is on the way!'
      : `Your order status has been updated to: ${status}`;

    const itemsList = items
      .map(item => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.productName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.platformName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        </tr>
      `)
      .join('');

    const emailResponse = await resend.emails.send({
      from: "SmartBasket <onboarding@resend.dev>",
      to: [userEmail],
      subject: `${statusEmoji} ${statusMessage} - Order #${orderId.slice(0, 8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #10b981; margin: 0;">🛒 SmartBasket</h1>
            <p style="color: #666; margin-top: 5px;">Smart Grocery Comparison</p>
          </div>

          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
            <h1 style="margin: 0 0 10px 0; font-size: 28px;">${statusEmoji} ${status}</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">${statusMessage}</p>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
            <p style="margin: 0 0 15px 0; font-size: 16px;">Hi ${userName},</p>
            ${status === 'Out for Delivery' ? `
              <p style="margin: 0; font-size: 15px; color: #555;">
                Great news! Your order is now out for delivery. Our delivery partner is on their way to you.
                ${deliveryEstimate ? `<br><br><strong>Estimated arrival:</strong> ${deliveryEstimate}` : ''}
              </p>
            ` : `
              <p style="margin: 0; font-size: 15px; color: #555;">
                Your order status has been updated. Here are the details:
              </p>
            `}
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Order Details</h3>
            <p style="margin: 0 0 5px 0;"><strong>Order ID:</strong> #${orderId.slice(0, 8).toUpperCase()}</p>
            <p style="margin: 0 0 5px 0;"><strong>Total:</strong> ₹${grandTotal.toFixed(2)}</p>
            ${deliveryAddress ? `<p style="margin: 0 0 5px 0;"><strong>Delivery Address:</strong> ${deliveryAddress}${deliveryCity ? `, ${deliveryCity}` : ''}</p>` : ''}
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Items in Your Order</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f1f5f9;">
                  <th style="padding: 10px 8px; text-align: left; font-weight: 600;">Item</th>
                  <th style="padding: 10px 8px; text-align: left; font-weight: 600;">Platform</th>
                  <th style="padding: 10px 8px; text-align: center; font-weight: 600;">Qty</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
          </div>

          ${status === 'Out for Delivery' ? `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>📱 Track Your Order:</strong> Open the SmartBasket app to see live updates and your delivery partner's location.
              </p>
            </div>
          ` : ''}

          <div style="text-align: center; padding: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Thank you for choosing SmartBasket!<br>
              If you have questions, please contact our support team.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Status update email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-order-status-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
