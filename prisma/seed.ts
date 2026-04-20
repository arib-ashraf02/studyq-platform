import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { name: "React" }, update: {}, create: { name: "React", color: "#61dafb" } }),
    prisma.tag.upsert({ where: { name: "Python" }, update: {}, create: { name: "Python", color: "#3776ab" } }),
    prisma.tag.upsert({ where: { name: "Algorithms" }, update: {}, create: { name: "Algorithms", color: "#f59e0b" } }),
    prisma.tag.upsert({ where: { name: "Machine Learning" }, update: {}, create: { name: "Machine Learning", color: "#22c55e" } }),
    prisma.tag.upsert({ where: { name: "Next.js" }, update: {}, create: { name: "Next.js", color: "#ffffff" } }),
    prisma.tag.upsert({ where: { name: "System Design" }, update: {}, create: { name: "System Design", color: "#a855f7" } }),
    prisma.tag.upsert({ where: { name: "Databases" }, update: {}, create: { name: "Databases", color: "#ef4444" } }),
    prisma.tag.upsert({ where: { name: "JavaScript" }, update: {}, create: { name: "JavaScript", color: "#f7df1e" } }),
    prisma.tag.upsert({ where: { name: "TypeScript" }, update: {}, create: { name: "TypeScript", color: "#3178c6" } }),
    prisma.tag.upsert({ where: { name: "Docker" }, update: {}, create: { name: "Docker", color: "#2496ed" } }),
    prisma.tag.upsert({ where: { name: "AWS" }, update: {}, create: { name: "AWS", color: "#ff9900" } }),
    prisma.tag.upsert({ where: { name: "CSS" }, update: {}, create: { name: "CSS", color: "#264de4" } }),
  ]);

  // Create demo users
  const user1 = await prisma.user.upsert({
    where: { email: "alice@studyq.dev" },
    update: {},
    create: {
      email: "alice@studyq.dev",
      name: "Alice Chen",
      reputation: 1240,
      role: "CONTRIBUTOR",
      bio: "Full-stack developer passionate about React and system design.",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "bob@studyq.dev" },
    update: {},
    create: {
      email: "bob@studyq.dev",
      name: "Bob Martinez",
      reputation: 890,
      role: "STUDENT",
      bio: "CS undergrad exploring ML and algorithms.",
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "carol@studyq.dev" },
    update: {},
    create: {
      email: "carol@studyq.dev",
      name: "Carol Davis",
      reputation: 2100,
      role: "CONTRIBUTOR",
      bio: "Backend engineer specializing in databases and distributed systems.",
    },
  });

  // Create questions
  const q1 = await prisma.question.create({
    data: {
      title: "How does React Fiber architecture improve render performance?",
      description: `I've been reading about React's reconciliation process but I'm struggling to understand the exact mechanics of \"incremental rendering\" and how it prioritizes updates.\n\nSpecifically:\n1. How does Fiber break work into units?\n2. What determines priority of updates?\n3. How does time-slicing actually work under the hood?\n\nCan someone explain this with a clear example? I've read the official docs but they're quite abstract.`,
      status: "RESOLVED",
      difficulty: "HARD",
      views: 342,
      authorId: user2.id,
      tags: { connect: [{ id: tags[0].id }, { id: tags[7].id }] },
    },
  });

  const q2 = await prisma.question.create({
    data: {
      title: "Solving the N-Queens problem using backtracking in Python",
      description: `I keep getting stuck in an infinite loop when trying to implement the safe check logic for diagonals.\n\nHere's my current approach:\n\`\`\`python\ndef is_safe(board, row, col, n):\n    for i in range(col):\n        if board[row][i] == 1:\n            return False\n    # Check upper diagonal\n    # Check lower diagonal\n    return True\n\`\`\`\n\nWhat am I missing for the diagonal checks? Also, is there a more efficient approach than O(n²) checking?`,
      status: "UNANSWERED",
      difficulty: "HARD",
      views: 89,
      authorId: user1.id,
      tags: { connect: [{ id: tags[1].id }, { id: tags[2].id }] },
    },
  });

  const q3 = await prisma.question.create({
    data: {
      title: "What's the difference between useMemo and useCallback?",
      description: `They seem to do the exact same thing (returning cached values) but the docs say one is for functions. Why can't I just use useMemo for everything?\n\nI've seen code like:\n\`\`\`tsx\nconst memoizedValue = useMemo(() => computeExpensive(a, b), [a, b]);\nconst memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);\n\`\`\`\n\nAren't these equivalent? When would I choose one over the other?`,
      status: "PARTIALLY_ANSWERED",
      difficulty: "MEDIUM",
      views: 567,
      authorId: user2.id,
      tags: { connect: [{ id: tags[0].id }, { id: tags[8].id }] },
    },
  });

  const q4 = await prisma.question.create({
    data: {
      title: "How to design a URL shortener system at scale?",
      description: `I'm preparing for system design interviews and need help understanding the complete architecture of a URL shortener like bit.ly.\n\nQuestions:\n- How to generate unique short codes?\n- How to handle billions of URLs?\n- What caching strategy to use?\n- How to handle analytics and click tracking?\n\nLooking for a comprehensive answer covering all trade-offs.`,
      status: "UNANSWERED",
      difficulty: "HARD",
      views: 23,
      authorId: user3.id,
      tags: { connect: [{ id: tags[5].id }, { id: tags[6].id }] },
    },
  });

  const q5 = await prisma.question.create({
    data: {
      title: "Understanding CSS Grid vs Flexbox — when to use which?",
      description: `I keep going back and forth between Grid and Flexbox. Sometimes Grid feels like overkill for simple layouts, but Flexbox gets messy with complex ones.\n\nCan someone give clear guidelines on:\n1. When to use Grid vs Flexbox?\n2. Can they be combined?\n3. Performance differences?`,
      status: "RESOLVED",
      difficulty: "EASY",
      views: 890,
      authorId: user1.id,
      tags: { connect: [{ id: tags[11].id }, { id: tags[7].id }] },
    },
  });

  // Create answers
  const a1 = await prisma.answer.create({
    data: {
      content: `Great question! React Fiber is essentially a reimplementation of React's core algorithm.\n\n## How Fiber Works\n\nFiber introduces **incremental rendering**, which means the ability to split rendering work into chunks and spread it out over multiple frames.\n\n### Key Concepts:\n\n1. **Work Units**: Each fiber node represents a unit of work. React can pause, abort, or reuse work as needed.\n\n2. **Priority Levels**: Updates are assigned priority — user interactions (high), data fetching (normal), offscreen rendering (low).\n\n3. **Time-Slicing**: React checks if there's remaining time in each frame (~16ms). If not, it yields to the browser.\n\n\`\`\`\nFrame budget: 16.67ms (60fps)\n├── React work: ~10ms  \n├── Browser painting: ~4ms\n└── Buffer: ~2.67ms\n\`\`\`\n\nThe key insight is that Fiber maintains a **linked list** of fibers rather than a recursive call stack, allowing it to pause and resume at any point.`,
      isAccepted: true,
      authorId: user3.id,
      questionId: q1.id,
    },
  });

  await prisma.answer.create({
    data: {
      content: `CSS Grid and Flexbox serve different layout needs:\n\n## Use Flexbox when:\n- Laying out items in a **single direction** (row or column)\n- You need items to **flex and fill** available space\n- Building nav bars, card rows, centering content\n\n## Use Grid when:\n- You need **two-dimensional** layouts (rows AND columns)\n- Building page-level layouts\n- Complex, asymmetric designs\n\n## Can they combine?\nAbsolutely! Use Grid for the page scaffold, Flexbox for component internals.\n\n## Performance\nBoth are extremely fast in modern browsers. Grid may trigger slightly more layout calculations, but the difference is negligible.`,
      isAccepted: true,
      authorId: user3.id,
      questionId: q5.id,
    },
  });

  await prisma.answer.create({
    data: {
      content: `The key difference is what they memoize:\n\n- **useMemo** memoizes the **return value** of a function\n- **useCallback** memoizes the **function itself**\n\n\`\`\`tsx\n// useMemo: caches the RESULT of calling the function\nconst sortedList = useMemo(() => sort(items), [items]);\n\n// useCallback: caches the FUNCTION REFERENCE\nconst handleClick = useCallback(() => onClick(id), [id]);\n\`\`\`\n\nUse \`useCallback\` when passing callbacks to optimized child components that rely on reference equality to prevent re-renders.`,
      isAccepted: false,
      authorId: user1.id,
      questionId: q3.id,
    },
  });

  // Create votes
  await prisma.vote.create({ data: { type: "UPVOTE", userId: user1.id, questionId: q1.id } });
  await prisma.vote.create({ data: { type: "UPVOTE", userId: user2.id, questionId: q1.id } });
  await prisma.vote.create({ data: { type: "UPVOTE", userId: user3.id, questionId: q3.id } });
  await prisma.vote.create({ data: { type: "UPVOTE", userId: user1.id, questionId: q5.id } });
  await prisma.vote.create({ data: { type: "UPVOTE", userId: user2.id, answerId: a1.id } });

  // Create comments
  await prisma.comment.create({
    data: {
      content: "This is an excellent explanation! The linked list analogy really helped me understand.",
      authorId: user2.id,
      answerId: a1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Could you also add an example with concurrent features like Suspense?",
      authorId: user1.id,
      questionId: q1.id,
    },
  });

  // Create badges
  await prisma.userBadge.create({ data: { name: "Top Helper", icon: "🏆", userId: user3.id } });
  await prisma.userBadge.create({ data: { name: "First Answer", icon: "🎯", userId: user1.id } });
  await prisma.userBadge.create({ data: { name: "Curious Mind", icon: "🧠", userId: user2.id } });

  // Create notifications
  await prisma.notification.create({
    data: {
      type: "ANSWER",
      message: "Carol Davis answered your question about React Fiber",
      link: `/questions/${q1.id}`,
      userId: user2.id,
    },
  });

  await prisma.notification.create({
    data: {
      type: "ACCEPTED",
      message: "Your answer was accepted! +25 reputation",
      link: `/questions/${q1.id}`,
      userId: user3.id,
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
