import type { CandidateResume, CandidateEvaluation, JobDescription, InterviewQuestion } from '../types';

export function generateInterviewKit(
  _candidate: CandidateResume,
  evaluation: CandidateEvaluation,
  _jd: JobDescription
): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];

  // 1. Generate Anomaly Probing Questions (if any flags exist)
  if (evaluation.anomalies.length > 0) {
    evaluation.anomalies.forEach((anomaly, idx) => {
      if (anomaly.type === 'TIMELINE_ANACHRONISM') {
        questions.push({
          id: `q-anach-${idx}`,
          category: 'ANOMALY_PROBING',
          question: `Your resume notes experience with ${anomaly.title.replace('Impossible ', '')}. Could you clarify the exact year you started working with this framework and describe your earliest project using it?`,
          rationale: `Probing Flagged Claim: ${anomaly.description}`,
          expectedAnswerHint: `Candidate should acknowledge timeline correction or clarify pre-release beta vs official adoption.`
        });
      } else if (anomaly.type === 'DATE_OVERLAP') {
        questions.push({
          id: `q-overlap-${idx}`,
          category: 'ANOMALY_PROBING',
          question: `Your work history shows overlapping full-time employment dates across multiple organizations. Were these concurrent contract engagements, or how was your time allocated?`,
          rationale: `Probing Flagged Claim: ${anomaly.description}`,
          expectedAnswerHint: `Look for clear explanation of contract/advisory arrangements vs full-time W2 employment.`
        });
      } else if (anomaly.type === 'UNSUBSTANTIATED_SKILL') {
        questions.push({
          id: `q-unsub-${idx}`,
          category: 'ANOMALY_PROBING',
          question: `You list several advanced skills in your summary header that aren't detailed in your employment bullet points. Can you walk us through a specific production project where you applied these tools?`,
          rationale: `Verifying unsubstantiated skills listed without work history proof.`,
          expectedAnswerHint: `Candidate should provide concrete metrics, architecture choices, and role responsibilities.`
        });
      }
    });
  }

  // 2. Generate Technical Deep-Dive Questions on Top Matched Skills
  const matchedSkills = evaluation.matchedSkills.filter(s => s.status === 'MATCHED').map(s => s.skill);
  if (matchedSkills.includes('PyTorch')) {
    questions.push({
      id: 'q-tech-pytorch',
      category: 'TECHNICAL_VERIFICATION',
      question: `How do you optimize PyTorch model inference latency when deploying LLMs or transformers into production FastAPI microservices?`,
      rationale: `Matches role requirement for PyTorch & high-throughput inference.`,
      expectedAnswerHint: `Mentions ONNX Runtime, TensorRT, TorchScript, batching, quantization (INT8/FP16), or vLLM.`
    });
  }

  if (matchedSkills.includes('Vector Databases') || matchedSkills.includes('RAG')) {
    questions.push({
      id: 'q-tech-rag',
      category: 'TECHNICAL_VERIFICATION',
      question: `Describe how you handle chunking strategies, embedding drift, and hybrid keyword-vector search in RAG pipelines.`,
      rationale: `Validates practical experience with vector search systems.`,
      expectedAnswerHint: `Discusses overlapping chunk sizes, BM25 + dense embedding hybrid search, re-ranking models (Cohere/ColBERT), and metadata filtering.`
    });
  }

  if (matchedSkills.includes('TypeScript') || matchedSkills.includes('React')) {
    questions.push({
      id: 'q-tech-react',
      category: 'TECHNICAL_VERIFICATION',
      question: `How do you manage client-side state, server-side data fetching, and performance rendering in large Next.js/React applications?`,
      rationale: `Core web architecture verification for React stack.`,
      expectedAnswerHint: `References Server Components, TanStack Query / SWR, memoization, and bundle optimization.`
    });
  }

  // 3. Generate Missing Skill Gap Assessment Questions
  if (evaluation.missingSkills.length > 0) {
    const missingSample = evaluation.missingSkills.slice(0, 2).join(' and ');
    questions.push({
      id: 'q-gap-1',
      category: 'GAP_ASSESSMENT',
      question: `This role requires hands-on experience with ${missingSample}. What experience do you have with similar technologies, and how would you ramp up?`,
      rationale: `Targeting skill gaps: [${evaluation.missingSkills.join(', ')}]`,
      expectedAnswerHint: `Evaluates adaptability, fast learning capability, and transferable technical concepts.`
    });
  }

  // 4. Behavioral & Seniority Leadership Question
  questions.push({
    id: 'q-beh-1',
    category: 'BEHAVIORAL',
    question: `Tell us about a time you had to balance technical debt with urgent product feature deadlines. What trade-offs did you make and what was the outcome?`,
    rationale: `Assessing pragmatic decision-making and cross-functional collaboration.`,
    expectedAnswerHint: `STAR method response detailing problem context, trade-offs made, and long-term refactoring plan.`
  });

  return questions;
}
