import pdfMappingData from '../data/pdfFileMappingMultilingual.json';
import { type VideoCourse } from '../data/videoCourses';

export function getNormalizedLanguage(lang?: string): string {
  if (!lang) return 'fr';
  const clean = lang.toLowerCase();
  if (clean.startsWith('en')) return 'en';
  if (clean.startsWith('de')) return 'de';
  if (clean.startsWith('es')) return 'es';
  if (clean.startsWith('it')) return 'it';
  if (clean.startsWith('ja')) return 'ja';
  if (clean.startsWith('zh')) return 'zh';
  return 'fr';
}

export function getCoursePdfUrl(courseIdOrCourse: string | VideoCourse, currentLang: string = 'fr'): string {
  const courseId = typeof courseIdOrCourse === 'string' ? courseIdOrCourse : courseIdOrCourse?.id;
  if (!courseId) return '';

  const lang = getNormalizedLanguage(currentLang);
  const mapping = pdfMappingData as Record<string, Record<string, string>>;

  // 1. Try current language mapping
  if (mapping[lang] && mapping[lang][courseId]) {
    return mapping[lang][courseId];
  }

  // 2. Fallback to French mapping
  if (mapping.fr && mapping.fr[courseId]) {
    return mapping.fr[courseId];
  }

  // 3. Fallback to course object pdfUrl if provided
  if (typeof courseIdOrCourse !== 'string' && courseIdOrCourse?.pdfUrl) {
    return courseIdOrCourse.pdfUrl;
  }

  return '';
}
