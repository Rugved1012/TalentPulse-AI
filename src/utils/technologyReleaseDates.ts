export interface TechReleaseInfo {
  name: string;
  releaseYear: number;
  aliases: string[];
}

export const TECH_RELEASE_DATABASE: Record<string, TechReleaseInfo> = {
  react: { name: 'React', releaseYear: 2013, aliases: ['reactjs', 'react.js'] },
  nextjs: { name: 'Next.js', releaseYear: 2016, aliases: ['next.js', 'next'] },
  vue: { name: 'Vue.js', releaseYear: 2014, aliases: ['vuejs', 'vue.js'] },
  angular: { name: 'Angular (v2+)', releaseYear: 2016, aliases: ['angular2', 'angular'] },
  typescript: { name: 'TypeScript', releaseYear: 2012, aliases: ['ts'] },
  rust: { name: 'Rust', releaseYear: 2015, aliases: ['rustlang'] },
  docker: { name: 'Docker', releaseYear: 2013, aliases: ['docker containers'] },
  kubernetes: { name: 'Kubernetes', releaseYear: 2014, aliases: ['k8s'] },
  pytorch: { name: 'PyTorch', releaseYear: 2016, aliases: ['torch'] },
  tensorflow: { name: 'TensorFlow', releaseYear: 2015, aliases: ['tf'] },
  transformers: { name: 'Hugging Face Transformers', releaseYear: 2018, aliases: ['huggingface', 'transformers'] },
  chatgpt: { name: 'ChatGPT / GPT-4', releaseYear: 2022, aliases: ['gpt-3.5', 'gpt-4', 'openai api'] },
  langchain: { name: 'LangChain', releaseYear: 2022, aliases: ['langchain'] },
  flutter: { name: 'Flutter', releaseYear: 2017, aliases: ['flutter'] },
  swift: { name: 'Swift', releaseYear: 2014, aliases: ['swift language'] },
  kotlin: { name: 'Kotlin', releaseYear: 2011, aliases: ['kotlin'] },
  snowflake: { name: 'Snowflake DB', releaseYear: 2014, aliases: ['snowflake'] },
  fastapi: { name: 'FastAPI', releaseYear: 2018, aliases: ['fastapi'] },
  vector_databases: { name: 'Pinecone / Qdrant / Weaviate', releaseYear: 2019, aliases: ['pinecone', 'chromadb', 'qdrant', 'weaviate'] },
};

export const CURRENT_YEAR = new Date().getFullYear(); // 2026

export function getMaxPossibleYearsForTech(techName: string): number | null {
  const normalized = techName.toLowerCase().trim();
  for (const key in TECH_RELEASE_DATABASE) {
    const tech = TECH_RELEASE_DATABASE[key];
    if (tech.name.toLowerCase() === normalized || tech.aliases.some(a => a.toLowerCase() === normalized)) {
      return CURRENT_YEAR - tech.releaseYear;
    }
  }
  return null;
}
