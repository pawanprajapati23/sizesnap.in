import { getExamBySlug, ExamSpec } from './examDatabase';

describe('getExamBySlug', () => {
  it('should return the correct exam spec for an existing slug (ssc-cgl)', () => {
    const exam = getExamBySlug('ssc-cgl');
    expect(exam).toBeDefined();
    expect(exam?.slug).toBe('ssc-cgl');
    expect(exam?.name).toBe('SSC CGL (Combined Graduate Level) Exam');
  });

  it('should return the correct exam spec for another existing slug (neet-ug)', () => {
    const exam = getExamBySlug('neet-ug');
    expect(exam).toBeDefined();
    expect(exam?.slug).toBe('neet-ug');
    expect(exam?.name).toBe('NTA NEET UG (National Eligibility cum Entrance Test)');
  });

  it('should return undefined for a non-existent slug', () => {
    const exam = getExamBySlug('non-existent-exam');
    expect(exam).toBeUndefined();
  });

  it('should return undefined for an empty string', () => {
    const exam = getExamBySlug('');
    expect(exam).toBeUndefined();
  });

  it('should return undefined when casing is incorrect (case-sensitive check)', () => {
    const exam = getExamBySlug('SSC-CGL');
    expect(exam).toBeUndefined();
  });
});
