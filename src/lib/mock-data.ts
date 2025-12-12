export type Exam = {
  id: string;
  title: string;
  course: string;
  type: 'MCQ' | 'True/False' | 'Short Answer' | 'Mixed';
  deadline?: string;
  totalSubmissions: number;
  gradedSubmissions: number;
};

export type StudentSubmission = {
  id: string;
  studentName: string;
  studentId: string;
  examId: string;
  score: number;
  matchPercentage: number;
  feedbackSummary: string;
  status: 'Graded' | 'Pending';
  originalAnswer: string;
  modelAnswer: string;
  rubric: string;
  feedback: {
    highlightedAnswer: string;
    detailedFeedback: string;
  };
};

export type Grievance = {
  id: string;
  studentName: string;
  examTitle: string;
  questionNumber?: number;
  grievanceType: 'Score Disagreement' | 'Incorrect Feedback' | 'Missing Answer' | 'Other';
  dateSubmitted: string;
  status: 'Pending' | 'Reviewed' | 'Resolved';
  details: string;
};

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    title: 'Data Structures Midterm',
    course: 'CS101',
    type: 'Mixed',
    deadline: '2024-10-26',
    totalSubmissions: 50,
    gradedSubmissions: 45,
  },
  {
    id: 'exam-2',
    title: 'Algorithms Final Exam',
    course: 'CS202',
    type: 'Short Answer',
    totalSubmissions: 35,
    gradedSubmissions: 35,
  },
  {
    id: 'exam-3',
    title: 'Programming Fundamentals Quiz',
    course: 'CS100',
    type: 'MCQ',
    deadline: '2024-11-15',
    totalSubmissions: 120,
    gradedSubmissions: 110,
  },
];

export const MOCK_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'clexam002',
    studentName: 'Alice Johnson',
    studentId: 'S001',
    examId: 'exam-1',
    score: 88,
    matchPercentage: 92,
    feedbackSummary: 'Good understanding of core concepts.',
    status: 'Graded',
    originalAnswer: "A binary search tree is a data structure where each node has at most two children. The left child is always less than the parent, and the right child is always greater.",
    modelAnswer: "A binary search tree (BST) is a rooted binary tree data structure with the key of each internal node being greater than all keys in the respective node's left subtree and less than the ones in its right subtree.",
    rubric: "5 points for definition. 3 points for mentioning the left/right child property. 2 points for mentioning the root.",
    feedback: {
      highlightedAnswer: 'A binary search tree is a data structure where each node has at most two children. <span class="bg-green-200">The left child is always less than the parent, and the right child is always greater.</span> You missed mentioning that this property applies recursively to all subtrees.',
      detailedFeedback: "Your definition is mostly correct, but you should emphasize that the property of left-child-less-than-parent and right-child-greater-than-parent holds for all nodes and subtrees in the tree, which is a key aspect of BSTs."
    }
  },
  {
    id: 'sub-2',
    studentName: 'Bob Williams',
    studentId: 'S002',
    examId: 'exam-1',
    score: 95,
    matchPercentage: 98,
    feedbackSummary: 'Excellent work!',
    status: 'Graded',
    originalAnswer: "A BST is a binary tree where for each node, all values in the left subtree are smaller than the node's value, and all values in the right are larger.",
    modelAnswer: "A binary search tree (BST) is a rooted binary tree data structure with the key of each internal node being greater than all keys in the respective node's left subtree and less than the ones in its right subtree.",
    rubric: "5 points for definition. 3 points for mentioning the left/right child property. 2 points for mentioning the root.",
    feedback: {
      highlightedAnswer: '<span class="bg-green-200">A BST is a binary tree where for each node, all values in the left subtree are smaller than the node\'s value, and all values in the right are larger.</span>',
      detailedFeedback: "Excellent and concise definition. You've captured the core properties of a Binary Search Tree perfectly."
    }
  },
  {
    id: 'sub-3',
    studentName: 'Charlie Brown',
    studentId: 'S003',
    examId: 'exam-2',
    score: 72,
    matchPercentage: 75,
    feedbackSummary: 'Needs improvement on Big O notation.',
    status: 'Graded',
    originalAnswer: 'The time complexity of quicksort is O(n log n).',
    modelAnswer: 'The time complexity of quicksort is O(n log n) on average and O(n^2) in the worst case.',
    rubric: "5 points for average case, 5 points for worst case.",
    feedback: {
      highlightedAnswer: 'The time complexity of quicksort is <span class="bg-green-200">O(n log n)</span>. <span class="bg-red-200">You forgot to mention the worst-case complexity.</span>',
      detailedFeedback: "You've correctly identified the average time complexity, which is great. However, it's crucial to also know the worst-case complexity of O(n^2) and understand when it occurs (e.g., with an already sorted array and a poor pivot selection strategy)."
    }
  },
];

export const MOCK_GRIEVANCES: Grievance[] = [
  {
    id: 'gri-1',
    studentName: 'Charlie Brown',
    examTitle: 'Algorithms Final Exam',
    questionNumber: 3,
    grievanceType: 'Score Disagreement',
    dateSubmitted: '2024-11-20',
    status: 'Pending',
    details: 'I believe my answer for question 3 was partially correct and deserved more points. I mentioned the average case complexity which is the most common one.',
  },
  {
    id: 'gri-2',
    studentName: 'Diana Prince',
    examTitle: 'Data Structures Midterm',
    grievanceType: 'Incorrect Feedback',
    dateSubmitted: '2024-10-28',
    status: 'Resolved',
    details: 'The feedback on question 5 was not clear. It said my answer was wrong but did not explain why.',
  },
];
