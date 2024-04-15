import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const initialOptions = {
  clientId: "AfINaljhwojaOzyIxzu_FRCwJQCsDcRg888FykZNl66iwKXHGp5RfWyVQq8ke0fKcp7ghURPXTPY3DA9",
  currency: "USD",
  intent: "authorize",
};

const PaypalButton = () => {

  return (
    <div>
        <PayPalScriptProvider options={initialOptions }>
            <PayPalButtons style={{ layout: "horizontal" }}   />
        </PayPalScriptProvider>
    </div>
  )
}

export default PaypalButton