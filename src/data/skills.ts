import type { SkillCategory } from '../types'

export const skills: SkillCategory[] = [
  { name: '백엔드', skills: ['Python', 'FastAPI', 'SQLAlchemy', 'Java', 'Spring'] },
  { name: '데이터베이스', skills: ['PostgreSQL'] },
  { name: '프런트엔드', skills: ['React', 'JavaScript', 'Vite', 'React Router'] },
  { name: '배포', skills: ['Docker', 'Nginx'] },
  {
    name: 'API 연동',
    skills: [
      'OpenAI API',
      '식약처 공공데이터 API',
      'Google·카카오·네이버 OAuth',
      'Web Push',
      'Gemini API',
      'JDoodle API',
    ],
  },
]
