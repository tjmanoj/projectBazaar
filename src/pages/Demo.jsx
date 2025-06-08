import React from "react";
import { useParams } from "react-router-dom";

function Demo() {
  const { projectId } = useParams();
  return (
    <div>
      <h2>Demo Preview</h2>
      {/* Show demo for projectId */}
      <p>Preview for project: {projectId}</p>
    </div>
  );
}

export default Demo;
