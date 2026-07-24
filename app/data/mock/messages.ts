/**
 * Typed mock conversations for the messages screens. One believable set is
 * shared by the role message views (see docs/BACKEND.md for the planned
 * messaging endpoints). Real data would be scoped per signed-in user and role.
 */

export type ChatMessage = { id: string; from: "me" | "them"; text: string; when: string };

export type Conversation = {
  id: string;
  name: string;
  role: string;
  preview: string;
  when: string;
  unread: number;
  messages: ChatMessage[];
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    name: "Mr Tunde Bello",
    role: "Mathematics teacher",
    preview: "Please remind Adaeze about the quiz tomorrow.",
    when: "10:24",
    unread: 2,
    messages: [
      { id: "m1", from: "them", text: "Good morning. Adaeze is doing well in class this term.", when: "10:20" },
      { id: "m2", from: "me", text: "Thank you, that is great to hear.", when: "10:22" },
      { id: "m3", from: "them", text: "Please remind Adaeze about the quiz tomorrow.", when: "10:24" },
    ],
  },
  {
    id: "c2",
    name: "School administration",
    role: "Front office",
    preview: "The parent-teacher meeting holds on Saturday.",
    when: "Yesterday",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "The parent-teacher meeting holds on Saturday at 10am.", when: "Yesterday" },
      { id: "m2", from: "me", text: "Noted, I will attend.", when: "Yesterday" },
    ],
  },
  {
    id: "c3",
    name: "Mrs Ngozi Eze",
    role: "Basic Science teacher",
    preview: "The lab report was well done.",
    when: "Mon",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "The lab report was well done. Keep it up.", when: "Mon" },
    ],
  },
];
