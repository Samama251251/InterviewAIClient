import { useEffect } from "react";

const InterviewComponent = () => {
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      console.log("User pasted something!");
      // Optionally send paste content for analysis
      fetch("/api/paste-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date(),
          data: e.clipboardData?.getData("text"), // optional
        }),
      });
    };

    const handleCopy = () => {
      console.log("User copied content!");
      // Optional: Log copying event
    };

    document.addEventListener("paste", handlePaste);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  return (
    <>
    </>
  );
};

export default InterviewComponent;
