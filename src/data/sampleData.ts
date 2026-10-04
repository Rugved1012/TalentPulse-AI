import type { JobDescription, CandidateResume } from '../types';

export const SAMPLE_JOB_DESCRIPTIONS: JobDescription[] = [
  {
    id: 'jd-aiml-lead',
    title: 'Senior AI / ML Engineer',
    department: 'Artificial Intelligence Research & Product',
    location: 'San Francisco, CA (Hybrid / Remote)',
    experienceMinYears: 4,
    experienceMaxYears: 8,
    requiredEducation: 'Master',
    requiredSkills: ['Python', 'PyTorch', 'Transformers', 'RAG', 'Vector Databases', 'Docker', 'FastAPI'],
    preferredSkills: ['LangChain', 'Kubernetes', 'AWS', 'TensorFlow', 'TypeScript'],
    description: `We are seeking an exceptional Senior AI/ML Engineer to lead the design, development, and deployment of production Large Language Model (LLM) applications, RAG pipelines, and high-throughput vector search systems. You will work closely with product and engineering teams to transform cutting-edge AI models into enterprise-grade services.`,
    responsibilities: [
      'Architect and scale RAG (Retrieval-Augmented Generation) systems utilizing vector databases (Pinecone, Qdrant) and Hugging Face Transformers.',
      'Fine-tune and optimize open-weights LLMs (Llama-3, Mistral) for domain-specific accuracy and low latency inference.',
      'Deploy robust containerized microservices using FastAPI, Docker, and Kubernetes on AWS/GCP.',
      'Implement evaluation benchmarks, automated test suites, and monitoring for LLM hallucination and retrieval precision.',
      'Mentor junior engineers and collaborate with cross-functional product stakeholders.'
    ],
    weights: {
      semantic: 30,
      skills: 40,
      experience: 15,
      education: 15
    }
  },
  {
    id: 'jd-fullstack-lead',
    title: 'Lead Full-Stack Engineer',
    department: 'Core Platform Engineering',
    location: 'New York, NY (Hybrid)',
    experienceMinYears: 5,
    experienceMaxYears: 10,
    requiredEducation: 'Bachelor',
    requiredSkills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'GraphQL'],
    preferredSkills: ['Python', 'AWS', 'Redis', 'Tailwind CSS', 'CI/CD'],
    description: `Join our team as Lead Full-Stack Engineer to architect high-performance, real-time web applications. You will own client-side React architecture and server-side TypeScript microservices.`,
    responsibilities: [
      'Lead front-end and backend architectural decisions using React, Next.js, and Node.js.',
      'Design clean PostgreSQL schemas, GraphQL APIs, and event-driven caching with Redis.',
      'Ensure high standards of performance, accessibility, and security across the web platform.'
    ],
    weights: {
      semantic: 25,
      skills: 45,
      experience: 20,
      education: 10
    }
  },
  {
    id: 'jd-cloud-arch',
    title: 'Principal Cloud Infrastructure Engineer',
    department: 'DevOps & Site Reliability',
    location: 'Seattle, WA (Remote)',
    experienceMinYears: 6,
    experienceMaxYears: 12,
    requiredEducation: 'Bachelor',
    requiredSkills: ['Kubernetes', 'Docker', 'AWS', 'Python', 'CI/CD', 'System Design'],
    preferredSkills: ['Terraform', 'GCP', 'Kafka', 'Rust', 'Redis'],
    description: `Architect enterprise cloud infrastructure, Kubernetes clusters, and automated deployment pipelines handling multi-region failovers.`,
    responsibilities: [
      'Design scalable multi-region AWS cloud infrastructure using Terraform and EKS Kubernetes.',
      'Automate CI/CD pipelines and microservice observability with Prometheus and Grafana.'
    ],
    weights: {
      semantic: 30,
      skills: 40,
      experience: 20,
      education: 10
    }
  }
];

export const SAMPLE_CANDIDATES: CandidateResume[] = [
  {
    id: 'cand-sarah-chen',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@ai-research.org',
    phone: '+1 (415) 892-3041',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/sarah-chen-phd',
    github: 'github.com/sarahchen-ai',
    summary: 'Senior AI Engineer with 6 years of experience specializing in LLM RAG pipelines, PyTorch model fine-tuning, and containerized FastAPI services. PhD in Computer Science from Stanford University.',
    extractedSkills: ['Python', 'PyTorch', 'Transformers', 'RAG', 'Vector Databases', 'Pinecone', 'Docker', 'FastAPI', 'LangChain', 'AWS', 'Kubernetes'],
    experience: [
      {
        id: 'exp-1',
        company: 'NeuralCorp Labs',
        title: 'Senior AI Research Engineer',
        startDate: '2022',
        endDate: 'Present',
        startYear: 2022,
        endYear: 2026,
        description: [
          'Architected production RAG pipeline using PyTorch, Hugging Face Transformers, and Pinecone vector database serving 500k daily queries.',
          'Built high-performance containerized microservices using FastAPI, Docker, and Kubernetes on AWS EKS.',
          'Fine-tuned domain LLMs reducing hallucination rates by 34% and improving semantic retrieval precision.'
        ],
        skillsUsed: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'Docker', 'Kubernetes', 'Pinecone']
      },
      {
        id: 'exp-2',
        company: 'DeepMind Innovations',
        title: 'Machine Learning Engineer',
        startDate: '2020',
        endDate: '2022',
        startYear: 2020,
        endYear: 2022,
        description: [
          'Developed neural text embedding models and transformer inference engines in PyTorch.',
          'Automated training pipelines using AWS SageMaker and Docker containers.'
        ],
        skillsUsed: ['Python', 'PyTorch', 'AWS', 'Docker']
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Ph.D. in Computer Science',
        field: 'Artificial Intelligence & Natural Language Processing',
        institution: 'Stanford University',
        graduationYear: 2020
      }
    ],
    certifications: ['AWS Certified Machine Learning Specialist'],
    rawText: `Dr. Sarah Chen
Email: sarah.chen@ai-research.org | Phone: +1 (415) 892-3041 | San Francisco, CA

SUMMARY
Senior AI Engineer with 6 years of experience specializing in LLM RAG pipelines, PyTorch model fine-tuning, and containerized FastAPI services. PhD in Computer Science from Stanford University.

SKILLS
Python, PyTorch, Transformers, RAG, Vector Databases, Pinecone, Docker, FastAPI, LangChain, AWS, Kubernetes

WORK EXPERIENCE
Senior AI Research Engineer | NeuralCorp Labs (2022 - Present)
- Architected production RAG pipeline using PyTorch, Hugging Face Transformers, and Pinecone vector database serving 500k daily queries.
- Built high-performance containerized microservices using FastAPI, Docker, and Kubernetes on AWS EKS.
- Fine-tuned domain LLMs reducing hallucination rates by 34% and improving semantic retrieval precision.

Machine Learning Engineer | DeepMind Innovations (2020 - 2022)
- Developed neural text embedding models and transformer inference engines in PyTorch.
- Automated training pipelines using AWS SageMaker and Docker containers.

EDUCATION
Ph.D. in Computer Science (Artificial Intelligence) | Stanford University (Graduated 2020)`,
    uploadTimestamp: new Date().toISOString(),
    pipelineStage: 'SHORTLISTED'
  },
  {
    id: 'cand-alex-rivera',
    name: 'Alex Rivera',
    email: 'alex.rivera@devstudio.io',
    phone: '+1 (212) 555-0149',
    location: 'New York, NY',
    linkedin: 'linkedin.com/in/arivera-dev',
    summary: 'Full Stack & ML Engineer with 5 years of hands-on experience building web applications, FastAPI backends, and integrating vector databases and PyTorch embeddings.',
    extractedSkills: ['Python', 'TypeScript', 'React', 'FastAPI', 'PyTorch', 'Vector Databases', 'Docker', 'PostgreSQL', 'Node.js'],
    experience: [
      {
        id: 'exp-1',
        company: 'Vanguard Software',
        title: 'Senior Software Engineer',
        startDate: '2022',
        endDate: 'Present',
        startYear: 2022,
        endYear: 2026,
        description: [
          'Developed RESTful API microservices with Python, FastAPI, and Docker for real-time analytics.',
          'Integrated Qdrant vector database and PyTorch sentence-transformers for product semantic search.'
        ],
        skillsUsed: ['Python', 'FastAPI', 'Docker', 'PyTorch', 'TypeScript']
      },
      {
        id: 'exp-2',
        company: 'Pulse Digital',
        title: 'Full Stack Developer',
        startDate: '2021',
        endDate: '2022',
        startYear: 2021,
        endYear: 2022,
        description: [
          'Built web interfaces with React and Node.js backend services connected to PostgreSQL.'
        ],
        skillsUsed: ['React', 'Node.js', 'PostgreSQL']
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Master of Science',
        field: 'Computer Science',
        institution: 'Columbia University',
        graduationYear: 2021
      }
    ],
    certifications: [],
    rawText: `Alex Rivera
Email: alex.rivera@devstudio.io | New York, NY

SUMMARY
Full Stack & ML Engineer with 5 years of hands-on experience building web applications, FastAPI backends, and integrating vector databases and PyTorch embeddings.

SKILLS
Python, TypeScript, React, FastAPI, PyTorch, Vector Databases, Docker, PostgreSQL, Node.js

WORK EXPERIENCE
Senior Software Engineer | Vanguard Software (2022 - Present)
- Developed RESTful API microservices with Python, FastAPI, and Docker for real-time analytics.
- Integrated Qdrant vector database and PyTorch sentence-transformers for product semantic search.

Full Stack Developer | Pulse Digital (2021 - 2022)
- Built web interfaces with React and Node.js backend services connected to PostgreSQL.

EDUCATION
Master of Science in Computer Science | Columbia University (2021)`,
    uploadTimestamp: new Date().toISOString(),
    pipelineStage: 'INBOX'
  },
  {
    id: 'cand-david-miller-flagged',
    name: 'David Miller (Contradiction Case)',
    email: 'david.miller.tech@gmail.com',
    phone: '+1 (510) 492-1029',
    location: 'Austin, TX',
    summary: 'Senior Lead AI Specialist claiming 14 years experience with React, 10 years experience with PyTorch and ChatGPT APIs.',
    extractedSkills: ['Python', 'React', 'PyTorch', 'ChatGPT', 'FastAPI', 'Docker', 'Transformers', 'RAG'],
    experience: [
      {
        id: 'exp-1',
        company: 'Apex Data Corp',
        title: 'Senior AI Specialist',
        startDate: '2022',
        endDate: 'Present',
        startYear: 2022,
        endYear: 2026,
        description: [
          'Utilized 14 years of React experience and 10 years of PyTorch experience to build web dashboards.',
          'Integrated ChatGPT and Llama models with Docker containers.'
        ],
        skillsUsed: ['React', 'PyTorch', 'Docker']
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science',
        field: 'Information Technology',
        institution: 'University of Texas at Austin',
        graduationYear: 2021
      }
    ],
    certifications: [],
    rawText: `David Miller
Email: david.miller.tech@gmail.com | Austin, TX

SUMMARY
Seasoned AI Engineering Lead boasting 14 years of React experience and 10 years of PyTorch experience building cutting-edge RAG applications.

SKILLS
Python, React, PyTorch, ChatGPT, FastAPI, Docker, Transformers, RAG

WORK EXPERIENCE
Senior AI Specialist | Apex Data Corp (2022 - Present)
- Utilized 14 years of React experience and 10 years of PyTorch experience to build web dashboards.
- Integrated ChatGPT and Llama models with Docker containers.

EDUCATION
Bachelor of Science in Information Technology | UT Austin (Graduated 2021)`,
    uploadTimestamp: new Date().toISOString(),
    pipelineStage: 'REJECTED'
  },
  {
    id: 'cand-jessica-zhang-unsubstantiated',
    name: 'Jessica Zhang (Unsubstantiated Case)',
    email: 'jessica.zhang@designcloud.net',
    phone: '+1 (206) 881-2290',
    location: 'Seattle, WA',
    summary: 'Software Engineer listing Rust, Quantum Computing, Kubernetes, PyTorch, and RAG in top skill summary.',
    extractedSkills: ['Python', 'Rust', 'Kubernetes', 'PyTorch', 'Transformers', 'RAG', 'Vector Databases', 'HTML', 'CSS', 'WordPress'],
    experience: [
      {
        id: 'exp-1',
        company: 'Creative Media Agency',
        title: 'Frontend Web Developer',
        startDate: '2023',
        endDate: 'Present',
        startYear: 2023,
        endYear: 2026,
        description: [
          'Maintained client WordPress themes and written standard HTML/CSS templates.',
          'Assisted with basic Python scripts for batch image resizing.'
        ],
        skillsUsed: ['HTML', 'CSS', 'WordPress', 'Python']
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Arts',
        field: 'Digital Media Design',
        institution: 'University of Washington',
        graduationYear: 2023
      }
    ],
    certifications: [],
    rawText: `Jessica Zhang
Email: jessica.zhang@designcloud.net | Seattle, WA

SUMMARY
Multi-talented Software Specialist with Rust, Quantum Computing, Kubernetes, PyTorch, and RAG expertise.

SKILLS
Python, Rust, Kubernetes, PyTorch, Transformers, RAG, Vector Databases, HTML, CSS, WordPress

WORK EXPERIENCE
Frontend Web Developer | Creative Media Agency (2023 - Present)
- Maintained client WordPress themes and written standard HTML/CSS templates.
- Assisted with basic Python scripts for batch image resizing.

EDUCATION
Bachelor of Arts in Digital Media Design | University of Washington (2023)`,
    uploadTimestamp: new Date().toISOString(),
    pipelineStage: 'REJECTED'
  },
  {
    id: 'cand-marcus-vance-overlap',
    name: 'Marcus Vance (Timeline Overlap Case)',
    email: 'marcus.vance@enterprise-sys.com',
    phone: '+1 (312) 604-9921',
    location: 'Chicago, IL',
    summary: 'Executive VP of Engineering holding 3 concurrent full-time senior positions simultaneously from 2022 to 2026.',
    extractedSkills: ['Python', 'FastAPI', 'Docker', 'AWS', 'Kubernetes', 'PostgreSQL', 'React'],
    experience: [
      {
        id: 'exp-1',
        company: 'Global Finance Corp',
        title: 'VP of Engineering',
        startDate: '2022',
        endDate: 'Present',
        startYear: 2022,
        endYear: 2026,
        description: [
          'Full-time VP of Engineering managing 40 developers and cloud infrastructure.'
        ],
        skillsUsed: ['AWS', 'Kubernetes']
      },
      {
        id: 'exp-2',
        company: 'NextGen Cloud Systems',
        title: 'Principal Architect',
        startDate: '2023',
        endDate: 'Present',
        startYear: 2023,
        endYear: 2026,
        description: [
          'Full-time Principal Architect overseeing microservices design and FastAPI deployments.'
        ],
        skillsUsed: ['FastAPI', 'Python', 'Docker']
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science',
        field: 'Computer Engineering',
        institution: 'University of Illinois Urbana-Champaign',
        graduationYear: 2022
      }
    ],
    certifications: [],
    rawText: `Marcus Vance
Email: marcus.vance@enterprise-sys.com | Chicago, IL

SUMMARY
Executive VP of Engineering holding 3 concurrent full-time senior positions simultaneously from 2022 to 2026.

SKILLS
Python, FastAPI, Docker, AWS, Kubernetes, PostgreSQL, React

WORK EXPERIENCE
VP of Engineering | Global Finance Corp (2022 - Present)
- Full-time VP of Engineering managing 40 developers and cloud infrastructure.

Principal Architect | NextGen Cloud Systems (2023 - Present)
- Full-time Principal Architect overseeing microservices design and FastAPI deployments.

EDUCATION
Bachelor of Science in Computer Engineering | UIUC (2022)`,
    uploadTimestamp: new Date().toISOString(),
    pipelineStage: 'REJECTED'
  },
  {
    id: 'cand-michael-scott-junior',
    name: 'Michael Scott',
    email: 'm.scott@dunder-tech.com',
    phone: '+1 (570) 348-1122',
    location: 'Scranton, PA',
    summary: 'Junior Python enthusiast with 1 year of internship experience writing script automation and basic web scrapers.',
    extractedSkills: ['Python', 'Git', 'SQL', 'HTML'],
    experience: [
      {
        id: 'exp-1',
        company: 'PaperTech Solutions',
        title: 'Junior Software Intern',
        startDate: '2025',
        endDate: 'Present',
        startYear: 2025,
        endYear: 2026,
        description: [
          'Wrote Python automation scripts for data entry and SQL reporting.'
        ],
        skillsUsed: ['Python', 'SQL']
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Arts',
        field: 'Business Administration',
        institution: 'Penn State University',
        graduationYear: 2024
      }
    ],
    certifications: [],
    rawText: `Michael Scott
Email: m.scott@dunder-tech.com | Scranton, PA

SUMMARY
Junior Python enthusiast with 1 year of internship experience writing script automation and basic web scrapers.

SKILLS
Python, Git, SQL, HTML

WORK EXPERIENCE
Junior Software Intern | PaperTech Solutions (2025 - Present)
- Wrote Python automation scripts for data entry and SQL reporting.

EDUCATION
Bachelor of Arts in Business Administration | Penn State University (2024)`,
    uploadTimestamp: new Date().toISOString(),
    pipelineStage: 'INBOX'
  }
];
