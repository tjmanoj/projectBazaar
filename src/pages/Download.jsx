import React from "react";
import { useParams } from "react-router-dom";

function Download() {
  const { projectId } = useParams();
  return (
    <div>
      <h2>Download Source Code</h2>
      {/* Download source code from Firebase Storage for projectId */}
      <p>Download link for project: {projectId}</p>
    </div>
  );
}

export default Download;
