# Judgment, Execution, Review, and Loop: Build Your Personal AI Runtime

Use goals, anchors, structure, and boundaries to keep human-AI collaboration on track.

One of the core ideas in *System and Freedom* is bounded infinity.

Real freedom emerges inside clear boundaries. A real boundary is not merely something you claim to have set. It is a structural fact that others can read, recognize, and choose not to cross.

Human-AI collaboration works the same way.

Large language models are powerful, but they naturally drift. They can hallucinate, invent internally consistent falsehoods, and lose important context across long work sessions. They are like an extremely smart coworker with fast hands, imperfect memory, and a dangerous talent for over-optimizing the wrong problem.

The deeper problem is built in. We still do not fully understand the operating principles of large models at a mathematical level. Much of the field still works by adjusting parameters, observing outputs, and accumulating hard-earned experience. Scale reaches a threshold, intelligence begins to emerge, and we still cannot fully explain why.

So a large model is better understood as a fast-evolving empirical engineering system, not a machine you can completely trust by reading a manual.

If you are interested in that line of thought, see the related OathAI essay: [Written When AI Has Become Inevitable](https://oathai.io/uncertain-future/written-when-ai-has-become-inevitable).

If you do not give it a goal, it does not know what it is supposed to do.
If you do not calibrate its anchors, it will drift away through a series of seemingly reasonable improvements.
If you do not set boundaries, it will expand your project's complexity until the whole thing becomes hard to maintain.
If you do not set a loop, it will stop after every step and ask what to do next.

The key to human-AI collaboration is to build a personal AI runtime: a bounded operating state in which AI can keep executing, checking, repairing, and moving forward while staying on a track fixed by goals, anchors, structure, and boundaries.

I call this structure a personal AI runtime.

Here, "runtime" does not mean a single tool. It means a work structure in which AI keeps executing, multiple AI threads can review one another, and the system waits for human judgment at the boundary.

Here is how to build a minimum version.

## 1. Prepare Your Work Entry Point

My current working setup looks like this as of June 2026:

```text
PC
Windows
Codex Windows App
GPT mobile app
GPT subscription account
```

This is only one available setup. You can use Claude, Gemini, Copilot, Grok, or similar products from other model providers. The brand is not the point. The capability mix is the point.

You need an AI work entry point that can read a local directory, execute tasks continuously, preserve project context, and collaborate with you over time. The mobile app is for capturing, starting, checking, and adding to tasks. The PC remains the main environment for reading local files and doing continuous execution.

## 2. Create a Working Directory on Your PC

Create a main project directory. Inside it, make at least three folders:

```text
01_raw_materials_and_documents
02_AI_work_documents
03_outputs
```

`01_raw_materials_and_documents` contains the material you prepare yourself: notes, drafts, screenshots, chat records, references, old versions, and background documents. The important point is simple: the human first places the source material into a readable space. AI needs access to the factual base.

`02_AI_work_documents` contains the documents AI will maintain: collaboration rules, project memory, task protocols, terminology, loop rules, and review checklists. You can and should review these documents yourself.

`03_outputs` contains final artifacts: essays, plans, translations, page copy, publishable versions, and delivery files. Keeping outputs separate prevents semantic confusion and preserves a clean boundary.

## 3. Write a Starter Collaboration Rulebook

Next, write a simple human-AI collaboration rulebook.

Keep it short. Start with the important parts:

```text
How you want AI to work.
What AI must not do.
What requires human approval.
Which materials must not be published.
Which factual claims must not be changed.
Where outputs should be placed.
How work should be checked.
When AI must stop.
```

This rulebook does not have to be complete on day one. It will grow during use and gradually become your operating system.

For example:

```text
Do not change the project goal without approval.
Do not rewrite the author's position.
Do not sacrifice the original judgment just to make a passage smoother.
Do not treat unconfirmed material as public fact.
When a new goal, new boundary, or new public meaning appears, stop and wait for human judgment.
```

This step matters because the most dangerous thing about AI is often not that it cannot do the work. It is that it can make the wrong work look reasonable. The rulebook is the first boundary you write down.

## 4. Create Three Project Conversations

In the Codex app on your PC, create project conversations and point them to the working directory you just set up.

I recommend at least three:

```text
Discussion thread
Execution thread
Review thread
```

The discussion thread understands materials, breaks down goals, and designs plans. This is where you align the goal, anchor, structure, and boundary.

The execution thread advances tasks according to the plan. It does not reinvent the direction. It works inside the confirmed structure.

The review thread finds mistakes, gaps, and risks. Do not skip review.

The minimum viable handoff is simple: all three threads share the same working directory; the discussion thread creates a task card; the human passes the task card to the execution thread; the execution result goes to the review thread. Once you are comfortable, you can automate more of the handoff.

The three conversations share the same working directory but play different roles. This separates judgment, execution, and review. It also keeps boundaries clear and prevents one conversation from growing into an uncontrolled context blob.

## 5. Use the First Conversation to Initialize the Environment

Do not ask AI to start producing work immediately.

First, ask the discussion thread to read your collaboration rules and then read `01_raw_materials_and_documents`.

You can say:

```text
Please read the collaboration rules and raw materials in the working directory.
Build project background context first.
```

Or:

```text
First understand what this project is, what materials exist, what the goal is, what positions are already confirmed, and which parts must not be changed without approval.
```

The purpose is to move AI from temporary chat mode into project understanding mode.

Many people run into trouble with AI because every task starts from an isolated prompt. AI does not know your history, your red lines, your long-term goal, or which expressions you have already approved. It can only guess inside the current window.

## 6. Let the Discussion Thread Generate the Four Operating Documents

Now ask AI to generate the four operating documents for the collaboration environment:

```text
AGENTS: AI behavior guide
MEMORY: long-term project memory
Protocol: task execution protocol
LOOP: loop mechanism
```

These four files can start from my [open-source Personal AI Runtime Templates](https://github.com/wangxiao8600/personal-ai-runtime-templates).

Give the templates to AI, then provide the raw materials, the goal, and the boundary. Let the discussion thread generate the first version suited to your project. Your job is to review the key judgments.

`AGENTS` is the AI behavior guide for the workspace. It tells AI who it is in this project, how it should work, what style it should follow, and when it must stop.

`MEMORY` is long-term project memory. It records project facts, author preferences, key terms, current state, confirmed judgments, and background information that should not be asked again and again.

`Protocol` defines task execution. It says how tasks are received, how materials are read, where outputs go, how work is checked, when AI can continue, and when it must return to human judgment.

`LOOP` defines the handoff cycle among discussion, execution, review, repair, and continuation. Without a loop, AI will often finish one step and stop.

If you use Codex or a similar environment that can read local files, the file names can be:

```text
AGENTS.md
MEMORY.md
TASK_PROTOCOL.md
LOOP.md
```

Each file only needs a minimum skeleton at first:

```text
AGENTS.md: role, default behavior, forbidden actions, stop rules.
MEMORY.md: project background, key terms, confirmed judgments, current state.
TASK_PROTOCOL.md: how to define target, input, output, and acceptance checks.
LOOP.md: discussion -> execution -> review -> repair -> update memory -> continue.
```

Also specify who maintains what:

```text
Discussion thread: mainly updates MEMORY, TASK_PROTOCOL, and LOOP.
Execution thread: follows TASK_PROTOCOL and updates task records and outputs when needed.
Review thread: provides findings and does not change goals or anchors.
Human: confirms AGENTS, boundaries, public positions, and major direction changes.
```

Once these four documents exist, you have built the minimum usable version of your human-AI collaboration environment.

But a skeleton still needs a test run.

## 7. Run a Minimum Loop

Do not start with a large task. Start with something small, verifiable, and file-producing.

For example:

```text
Using the materials in 01_raw_materials_and_documents,
create a project introduction under 800 words,
and place it in 03_outputs.
```

First, ask the discussion thread to create a task card. The task card should state:

```text
What the goal is.
Where the input material is.
Where the output file should go.
What the acceptance checks are.
Which parts AI must not decide on its own.
```

Then give the task card to the execution thread. After execution, give the output to the review thread. The review thread has one job: determine whether the output drifted from the goal, anchor, structure, or boundary.

If review finds a problem, send it back to the execution thread for repair. After repair, ask the discussion thread to update `MEMORY.md` or `LOOP.md` with any newly confirmed rule or lesson.

At this point, you have not just created some files. You have completed one real loop:

```text
discussion -> execution -> review -> repair -> update memory
```

Once this loop runs, your human-AI work environment begins to live.

## 8. Look Back at the Structure

This method can be reduced to four locking points:

```text
goal
anchor
structure
boundary
```

It can also be unfolded into four actions:

```text
judgment
execution
review
loop
```

The goal answers: what exactly are we trying to finish?

The anchor answers: which judgments, facts, style decisions, and positions must not drift?

The structure answers: how is the task divided, where does material live, how are roles separated, how is output delivered, and how do the parts relate?

The boundary answers: what must not be done, what must not be published, what factual claim must not change, and which decisions require human confirmation?

Humans are responsible for these things.

What is AI responsible for?

AI reads materials, organizes information, drafts plans, executes tasks, checks outputs, sends work to review, repairs findings, updates working documents, and keeps moving inside the confirmed track.

This is the future shape of human-AI collaboration.

Humans no longer need to watch every step. Humans should not become confirmation buttons. Humans lock the goal, anchor, structure, and boundary. AI works continuously inside that track.

## 9. Why You Need a Review Thread

Many people ask: if the main AI can self-check, why do I need another review thread?

The reason is simple: execution and review must be separated.

Human-AI collaboration without a review layer is just a drifting output system plugged into your workflow.

One thread pushes forward. Another thread finds errors. One gets the work done. The other checks whether the work drifted from the goal, smuggled in a concept change, added unnecessary complexity, or missed risk.

This is division of labor for AI.

Human teams already work this way. Writers and editors are different roles. Engineers and reviewers are different roles. Once human-AI collaboration becomes a work environment, it needs the same structural separation.

The review thread should especially check:

```text
Has the goal been quietly changed?
Has the anchor drifted?
Has the structure been over-expanded?
Has a boundary been crossed?
Has a factual claim changed?
Has the public meaning changed?
Does the output actually satisfy the task?
```

This step determines whether the AI work loop can remain stable over time.

## 10. When AI Must Stop and Ask the Human

AI can keep moving, but it cannot run without limit.

I put these cases into stop rules:

```text
A new goal appears.
A new structure appears.
A new boundary appears.
A new anchor appears.
A factual claim needs to change.
The author's position needs to change.
Raw material may need to be published.
The output creates new public meaning.
The work touches legal, copyright, reputation, trading, financial, or other irreversible consequences.
```

In these cases, AI must stop and return to human judgment.

These are judgment problems. Judgment cannot be outsourced to a model. A model can help analyze options, but the final judgment must be made by a human.

## 11. The Real Change

The real change is larger than getting AI to do more tasks.

The real change is that you begin to build your own personal AI runtime.

This runtime points to a work structure: humans handle judgment, goals, anchors, and boundaries; AI advances continuously inside the track; the review layer prevents drift, concept substitution, and complexity inflation.

In the old mode, we treated AI as an assistant:

```text
Human asks.
AI answers.
Human follows up.
AI answers again.
```

That mode is useful, but it easily turns the human into an operator who keeps adding context, pressing confirmation, and rescuing the work from drift.

The future mode should look different:

```text
Humans confirm the goal, anchor, structure, and boundary.
AI executes, checks, hands off, repairs, and continues.
The review thread keeps finding problems.
The main AI does not leave the loop until a new judgment point appears.
```

This builds a controllable operating track for AI and prevents it from running fully automatic without boundaries.

AI automation without boundaries will bring model drift, hallucination, local optimization, and complexity inflation directly into your work.

Once locked by goals, anchors, structure, and boundaries, AI can move from being a smart chat window to becoming a work loop that keeps advancing.

The future personal work environment will not merely be a smarter dialog box.

It will be a personal AI runtime made of loops that keep executing, review one another, and wait for human judgment at the boundary.

Only the bounded can become infinite.

---

## 👤 About the Author

🪪 **Wang Xiao** is an AI protocol architect, author of *System and Freedom*, creator of Danbing AI Protocol / SLAPS Framework, and initiator of OathAI.

His work focuses on **human-AI co-creation**, **protocol governance**, **semantic anchoring**, and **long-term knowledge continuity** — exploring how human knowledge and collaborative structures can be preserved, calibrated, and inherited in the AI era.

📚 **System and Freedom**: [https://oathai.io/system-and-freedom](https://oathai.io/system-and-freedom)

🌐 **21-language editions and cover index**: [https://oathai.io/cover](https://oathai.io/cover)

📖 **Whitepapers and implementation chain**: [https://oathai.io/whitepapers](https://oathai.io/whitepapers)

🧭 **OathAI Archive**: [https://oathai.io](https://oathai.io)

## ⚠️ Disclaimer

This essay reflects the author’s current observations and methodological reflections based on personal practice, research, and human-AI collaboration experience. The related Danbing / SLAPS / OathAI methods are still being organized and evolved. Their practical effects may vary depending on the user’s background, task context, model capability, execution environment, and level of commitment.

This essay does not constitute legal, investment, medical, career, or technical implementation advice or guarantee. Readers who apply these methods in real projects should make independent judgments based on their own circumstances and take responsibility for specific outcomes.

🧠 *OathAI.io · Built from rhythm. Run by structure. Auditable by snapshot. Governed by oath.*

---

https://medium.com/@wangxiao8600/judgment-execution-review-and-loop-build-your-personal-ai-runtime-ee65d723590f
