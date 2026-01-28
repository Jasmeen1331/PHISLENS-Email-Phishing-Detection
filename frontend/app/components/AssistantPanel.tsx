"use client";

import AvatarCard from "./AvatarCard";

export default function AssistantPanel({
  status,
  message,
}: {
  status: "idle" | "thinking" | "explaining";
  message: string;
}) {
  return (
    <div className="assistantWrap">
      <AvatarCard status={status} title="Lensa • PHISHLENS" message={message} />
    </div>
  );
}
