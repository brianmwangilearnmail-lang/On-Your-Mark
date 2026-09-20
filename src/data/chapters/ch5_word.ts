import { Chapter } from '../../types';

export const chapter5: Chapter = {
  id: 'ch5',
  slug: 'word-of-god',
  title: 'Chapter 5: The Power of the Word',
  order: 5,
  modules: [
    {
      id: 'm5_1',
      chapterId: 'ch5',
      slug: 'feeding-on-scripture',
      title: 'Feeding on Scripture',
      description: 'Renewing your mind through daily study and meditation.',
      order: 1,
      estimatedMinutes: 7,
      sections: [
        {
          id: 's5_1_1',
          title: 'Spiritual Food',
          content: 'Man shall not live by bread alone, but by every word that proceeds from the mouth of God (Matthew 4:4).',
          order: 1
        }
      ],
      reflections: [
        {
          id: 'r5_1_1',
          question: 'How do you structure your daily Scripture reading routine?',
          order: 1
        }
      ]
    }
  ]
};
