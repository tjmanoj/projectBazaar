import React from "react";
import { useParams } from "react-router-dom";

function Payment() {
  const { projectId } = useParams();
  return (
    <div>
      <h2>Payment</h2>
      {/* Razorpay payment integration for projectId */}
      <p>Pay to access project: {projectId}</p>
    </div>
  );
}

export default Payment;
